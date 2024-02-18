const { Pool } = require("pg");
const fs = require("fs");
const sql = fs.readFileSync("schema.sql").toString();
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const dbReadPool = new Pool({
  host: process.env.DB_READ_HOST,
  port: process.env.DB_READ_PORT,
  user: process.env.DB_READ_USER,
  password: process.env.DB_READ_PASSWORD,
  database: process.env.DB_READ_DATABASE
});

const dbCreatePool = new Pool({
  host: process.env.DB_CREATE_HOST,
  port: process.env.DB_CREATE_PORT,
  user: process.env.DB_CREATE_USER,
  password: process.env.DB_CREATE_PASSWORD,
  database: process.env.DB_CREATE_DATABASE
});

async function createTables() {
  try {
    await pool.query(sql);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = { dbReadPool, dbCreatePool, createTables };
