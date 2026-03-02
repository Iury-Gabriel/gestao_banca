const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true,
  tableName: 'users'
});

const UserSetting = sequelize.define('UserSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entry_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  daily_goal_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 10.0
  },
  stop_loss_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 10.0
  }
}, {
  underscored: true,
  tableName: 'user_settings'
});

const Bankroll = sequelize.define('Bankroll', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  current_balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  }
}, {
  underscored: true,
  tableName: 'bankroll'
});

const BankrollEvent = sequelize.define('BankrollEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING, // WIN, LOSS, MANUAL
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  balance_before: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  balance_after: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  underscored: true,
  tableName: 'bankroll_events'
});

// Associations
User.hasOne(UserSetting, { foreignKey: 'user_id', as: 'settings', onDelete: 'CASCADE' });
UserSetting.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Bankroll, { foreignKey: 'user_id', as: 'bankroll', onDelete: 'CASCADE' });
Bankroll.belongsTo(User, { foreignKey: 'user_id' });

Bankroll.hasMany(BankrollEvent, { foreignKey: 'bankroll_id', as: 'events', onDelete: 'CASCADE' });
BankrollEvent.belongsTo(Bankroll, { foreignKey: 'bankroll_id' });

module.exports = { User, UserSetting, Bankroll, BankrollEvent, sequelize };
