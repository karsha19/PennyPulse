require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('✅ Database created or already exists:', process.env.DB_NAME);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    process.exit(1);
  }
})();
