const { User, UserSetting, Bankroll } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, initialBankroll } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      settings: {
        entry_percent: 5.0,
        daily_goal_percent: 10.0,
        stop_loss_percent: 10.0,
      },
      bankroll: {
        current_balance: initialBankroll || 0.0,
      }
    }, {
      include: [
        { model: UserSetting, as: 'settings' },
        { model: Bankroll, as: 'bankroll' }
      ]
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: UserSetting, as: 'settings' },
        { model: Bankroll, as: 'bankroll' }
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings,
        bankroll: user.bankroll
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
