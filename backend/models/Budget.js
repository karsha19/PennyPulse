const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One budget row = one category's monthly limit for a given user & month
const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category_id',
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  month: {
    type: DataTypes.INTEGER, // 1-12
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'budgets',
  indexes: [
    { unique: true, fields: ['user_id', 'category_id', 'month', 'year'] },
  ],
});

module.exports = Budget;
