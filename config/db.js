const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "clubhouse_r20g",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Function to create tables
async function initializeDatabase() {
  try {
    await pool.query(createTables);
    console.log("Tables created successfully or already exist.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initializeDatabase,
};
