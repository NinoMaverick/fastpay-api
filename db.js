import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool ({
  max: 20,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

export default pool;