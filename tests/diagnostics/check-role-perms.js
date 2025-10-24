// check-roles-perms.js
import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
  },
});

(async () => {
  try {
    const roles = await db.select("*").from("roles");
    const permissions = await db.select("*").from("permissions");
    const rolePermissions = await db.select("*").from("role_permissions");

    console.log("🧩 Roles:");
    console.table(roles);

    console.log("\n🔐 Permissions:");
    console.table(permissions);

    console.log("\n🔗 Role → Permission Mappings:");
    console.table(rolePermissions);
  } catch (err) {
    console.error("❌ Error checking DB:", err.message);
  } finally {
    await db.destroy();
  }
})();
