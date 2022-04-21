import mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});