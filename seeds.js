import knex from "knex";
import config from "./knexfile.js";

const db = knex(config.development);

async function seed() {
  try {
    // ==============================
    // 1️⃣  SEED ROLES
    // ==============================
    await db("roles").insert([
      { name: "Admin", description: "Full access to system" },
      { name: "User", description: "Regular user with limited access" },
    ]);

    // ==============================
    // 2️⃣  SEED PERMISSIONS
    // ==============================
    await db("permissions").del(); // clear existing permissions
    await db("permissions").insert([
      {
        name: "CREATE_PAYMENT",
        description: "Users can initiate a payment",
      },
      {
        name: "READ_PAYMENT",
        description: "Users can view their own payment history",
      },
      {
        name: "READ_ALL_PAYMENTS",
        description: "Admins can view all users’ payments",
      },
      {
        name: "UPDATE_PAYMENT_STATUS",
        description: "Admins can update payment status",
      },
    ]);

    // ==============================
    // 3️⃣  FETCH RECORDS FOR RELATIONS
    // ==============================
    const roles = await db("roles").select();
    const permissions = await db("permissions").select();

    // Helper functions
    const findRoleId = (roleName) =>
      roles.find((r) => r.name === roleName)?.id;

    const findPermissionId = (permName) =>
      permissions.find((p) => p.name === permName)?.id;

    // ==============================
    // 4️⃣  SEED ROLE ↔ PERMISSION MAP
    // ==============================
    await db("role_permissions").del(); // clear existing mappings

    await db("role_permissions").insert([
      // ----- USER ROLE -----
      {
        role_id: findRoleId("User"),
        permission_id: findPermissionId("CREATE_PAYMENT"),
      },
      {
        role_id: findRoleId("User"),
        permission_id: findPermissionId("READ_PAYMENT"),
      },

      // ----- ADMIN ROLE -----
      {
        role_id: findRoleId("Admin"),
        permission_id: findPermissionId("READ_PAYMENT"),
      },
      {
        role_id: findRoleId("Admin"),
        permission_id: findPermissionId("CREATE_PAYMENT"),
      },
      {
        role_id: findRoleId("Admin"),
        permission_id: findPermissionId("READ_ALL_PAYMENTS"),
      },
      {
        role_id: findRoleId("Admin"),
        permission_id: findPermissionId("UPDATE_PAYMENT_STATUS"),
      },
    ]);

    // ==============================
    // ✅  DONE
    // ==============================
    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
