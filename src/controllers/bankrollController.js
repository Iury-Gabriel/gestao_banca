const { Bankroll, BankrollEvent } = require('../models');
const sequelize = require('../database');

exports.getBankroll = async (req, res) => {
  try {
    const bankroll = await Bankroll.findOne({
      where: { user_id: req.userId }
    });
    res.json(bankroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { type, amount } = req.body;
    
    const bankroll = await Bankroll.findOne({
      where: { user_id: req.userId },
      transaction: t
    });

    if (!bankroll) throw new Error('Bankroll not found');

    const balance_before = bankroll.current_balance;
    let balance_after = balance_before + amount;

    if (type === 'WITHDRAW') {
      if (balance_before < Math.abs(amount)) {
        throw new Error('Saldo insuficiente para saque');
      }
      balance_after = balance_before - Math.abs(amount);
    }

    const event = await BankrollEvent.create({
      bankroll_id: bankroll.id,
      type,
      amount: type === 'WITHDRAW' ? -Math.abs(amount) : amount,
      balance_before,
      balance_after
    }, { transaction: t });

    await Bankroll.update({
      current_balance: balance_after
    }, {
      where: { id: bankroll.id },
      transaction: t
    });

    await t.commit();
    res.status(201).json({ event, current_balance: balance_after });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const bankroll = await Bankroll.findOne({
      where: { user_id: req.userId }
    });

    if (!bankroll) return res.status(404).json({ error: 'Bankroll not found' });

    const history = await BankrollEvent.findAll({
      where: { bankroll_id: bankroll.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
