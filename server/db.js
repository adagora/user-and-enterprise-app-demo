const { Pool } = require("pg");
const fs = require("fs");
const sql = fs.readFileSync("schema.sql").toString();

const pool = new Pool({
  host: "db",
  port: 5432,
  user: "user123",
  password: "password123",
  database: "db123",
});

const dbReadPool = new Pool({
  host: "db",
  port: 5432,
  user: "dbread",
  password: "dbread",
  database: "db123",
});

const dbWritePool = new Pool({
  host: "db",
  port: 5432,
  user: "dbwrite",
  password: "dbwrite",
  database: "db123",
});

async function createTables() {
  try {
    await pool.query(sql);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = { dbReadPool, dbWritePool, createTables };
