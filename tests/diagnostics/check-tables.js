import knex from "knex";
import config from "../../knexfile.js";

const db = knex(config.development);

try {
  const tables = await db.raw(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public';
  `);
  console.log("Tables in DB:", tables.rows.map(r => r.table_name));
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
