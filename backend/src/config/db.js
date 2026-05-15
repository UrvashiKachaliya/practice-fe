import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.promise().query("SELECT 1")
  .then(() => console.log(`MySQL Pool connected to ${process.env.DB_NAME}`))
  .catch((err) => console.error("DB Pool Error:", err));

export default db;