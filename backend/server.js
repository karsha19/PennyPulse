require('dotenv').config();
const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('./models'); // registers associations

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // Sync models -> creates tables if they don't exist yet (safe for dev).
  // For production, prefer proper migrations instead of sync({ alter: true }).
  await sequelize.sync();
  console.log('✅ Database synced.');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
