// Enable access to .env variables
require('dotenv').config();

// Use environment variables to connect to database
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host:'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = connection;