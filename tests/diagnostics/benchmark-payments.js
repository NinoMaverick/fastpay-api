import pool from "../../db.js";

async function benchmark() {
  console.time("🔍 Query time");
  const result = await pool.query(`
  SELECT * FROM payments WHERE status = 'SUCCESS' LIMIT 100
`);
  console.timeEnd("🔍 Query time");
  console.log(`Rows returned: ${result.rowCount}`);
  await pool.end();
}

benchmark().catch(console.error);