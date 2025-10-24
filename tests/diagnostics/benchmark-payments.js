import dotenv from "dotenv";
import pool from "../../db.js";

dotenv.config();

async function benchmark() {
  console.log("🚀 Running payment query benchmark...\n");

  console.time("Query time (indexed)");
  const result = await pool.query(`
    SELECT * FROM payments
    WHERE status = 'SUCCESS'
    LIMIT 100;
  `);
  console.timeEnd("Query time (indexed)");
  console.log(`✅ Rows returned: ${result.rowCount}`);

  await pool.end();
}

benchmark().catch(console.error);
