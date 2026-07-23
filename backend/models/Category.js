const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense', 'both'),
    allowNull: false,
    defaultValue: 'expense',
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'Tag', // lucide-react icon name
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#6366f1',
  },
}, {
  tableName: 'categories',
});

module.exports = Category;
