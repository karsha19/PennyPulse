// Run with: npm run seed
// Populates the categories table with the default set used across the app.
require('dotenv').config();
const { sequelize, Category } = require('../models');

const defaultCategories = [
  { name: 'Food', type: 'expense', icon: 'Utensils', color: '#f97316' },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#0ea5e9' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Bills', type: 'expense', icon: 'Receipt', color: '#ef4444' },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#a855f7' },
  { name: 'Health', type: 'expense', icon: 'HeartPulse', color: '#22c55e' },
  { name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#6366f1' },
  { name: 'Salary', type: 'income', icon: 'Wallet', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#14b8a6' },
  { name: 'Others', type: 'both', icon: 'Tag', color: '#64748b' },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates tables if not present

    for (const cat of defaultCategories) {
      await Category.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }

    console.log('✅ Categories seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
