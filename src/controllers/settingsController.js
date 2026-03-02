const { UserSetting } = require('../models');

exports.getSettings = async (req, res) => {
  try {
    const settings = await UserSetting.findOne({
      where: { user_id: req.userId }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { entry_percent, daily_goal_percent, stop_loss_percent } = req.body;
    const settings = await UserSetting.update({
      entry_percent,
      daily_goal_percent,
      stop_loss_percent
    }, {
      where: { user_id: req.userId },
      returning: true
    });
    res.json(settings[1][0]); // Sequelize update returns [affectedCount, affectedRows]
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
