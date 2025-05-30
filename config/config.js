import mysql2 from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Load environment variables

// MySQL connection pool setup
const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
export { pool };