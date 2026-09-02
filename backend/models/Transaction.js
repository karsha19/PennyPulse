const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
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
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mood: {
    type: DataTypes.ENUM('necessity', 'celebration', 'stress', 'boredom', 'other'),
    allowNull: true,
  },
}, {
  tableName: 'transactions',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['date'] },
    { fields: ['type'] },
  ],
});

module.exports = Transaction;
