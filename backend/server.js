require('dotenv').config();
const app = require('./app');
const { sequelize, connectDB } = require('./config/db');
require('./models'); 

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  
  await sequelize.sync({ alter: true });
  console.log('✅ Database synced.');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

start();
