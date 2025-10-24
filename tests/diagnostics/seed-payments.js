import dotenv from "dotenv";
import pool from "../../db.js";

dotenv.config();

function generateUUID() {
  // Generate random UUIDs for seeding
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function seedPayments() {
  console.time("⏱️ Seeding payments");

  try {
    await pool.query("DELETE FROM payments");

    const statuses = ["SUCCESS", "FAILED", "PENDING"];
    const values = [];

    for (let i = 0; i < 10000; i++) {
      const userId = generateUUID();
      const amount = (Math.random() * 10000).toFixed(2);
      const currency = ["NGN", "USD", "EUR"][Math.floor(Math.random() * 3)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const reference = `ref-${i}-${Date.now()}`;
      values.push(`('${userId}', ${amount}, '${currency}', '${status}', '${reference}')`);
    }

    const insertQuery = `
      INSERT INTO payments (user_id, amount, currency, status, reference)
      VALUES ${values.join(",")}
    `;

    await pool.query(insertQuery);
    console.timeEnd("⏱️ Seeding payments");
    console.log("✅ Done seeding 10,000 payments");
  } catch (err) {
    console.error("❌ Error seeding payments:", err);
  } finally {
    await pool.end();
  }
}

seedPayments();
