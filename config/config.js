import mysql2 from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Load env variables

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export const API_URL = "http://localhost:3000";
export { pool };
