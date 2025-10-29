import knex from "knex";
import config from "./knexfile.js";
import bcrypt from "bcrypt";

const db = knex(config.development);

console.log("🚀 Seed script started");

// ==============================
// Constants
// ==============================
const ROLES = [
  { name: "admin", description: "Full access to system" },
  { name: "user", description: "Regular user with limited access" },
];

const PERMISSIONS = [
  { name: "CREATE_PAYMENT", description: "Users can initiate a payment" },
  { name: "READ_PAYMENT", description: "Users can view their own payment history" },
  { name: "READ_ALL_PAYMENTS", description: "Admins can view all users' payments" },
  { name: "UPDATE_PAYMENT_STATUS", description: "Admins can update payment status" },
];

const ROLE_PERMISSION_MAP = {
  user: ["CREATE_PAYMENT", "READ_PAYMENT"],
  admin: [
    "CREATE_PAYMENT",
    "READ_PAYMENT",
    "READ_ALL_PAYMENTS",
    "UPDATE_PAYMENT_STATUS",
  ],
};

const DEFAULT_ADMIN = {
  email: "admin@fastpay.local",
  password: "AdminPass123",
  full_name: "System Admin",
};

// ==============================
// Helper functions
// ==============================
const findById = (items, key, value) =>
  items.find((item) => item[key] === value)?.id;

async function clearTable(tableName) {
  await db(tableName).del();
  console.log(`🧹 Cleared ${tableName} table`);
}

// ==============================
// Seed functions
// ==============================
async function seedRoles() {
  console.log(" Seeding roles...");
  await clearTable("roles");
  await db("roles").insert(ROLES);
  return await db("roles").select();
}

async function seedPermissions() {
  console.log(" Seeding permissions...");
  await clearTable("permissions");
  await db("permissions").insert(PERMISSIONS);
  return await db("permissions").select();
}

async function seedRolePermissions(roles, permissions) {
  console.log(" Linking roles and permissions...");
  await clearTable("role_permissions");

  const mappings = [];

  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSION_MAP)) {
    const roleId = findById(roles, "name", roleName);

    for (const permName of permNames) {
      const permId = findById(permissions, "name", permName);
      if (roleId && permId) {
        mappings.push({ role_id: roleId, permission_id: permId });
      }
    }
  }

  if (mappings.length > 0) {
    await db("role_permissions").insert(mappings);
  }
}

async function seedAdminUser(roles) {
  console.log(" Creating admin user...");

  const adminRole = roles.find((r) => r.name === "admin");
  if (!adminRole) throw new Error("Admin role not found");

  const existingAdmin = await db("users")
    .where({ email: DEFAULT_ADMIN.email })
    .first();

  if (existingAdmin) {
    console.log(" Admin user already exists, skipping creation");
    return;
  }

  // Hash the admin password
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

  await db("users").insert({
    email: DEFAULT_ADMIN.email,
    password_hash: passwordHash,
    full_name: DEFAULT_ADMIN.full_name,
    role_id: adminRole.id,
  });

  console.log(` Admin user created: ${DEFAULT_ADMIN.email}`);
}

// ==============================
// Main seeding process
// ==============================
async function seed() {
  try {
    console.log(" Starting database seed...\n");

    // Use transaction for atomicity
    await db.transaction(async (trx) => {
      const roles = await seedRoles();
      const permissions = await seedPermissions();
      await seedRolePermissions(roles, permissions);
      await seedAdminUser(roles);
    });

    console.log("\n✅ Seeding completed successfully!");
  } catch (err) {
    console.error("\n❌ Seeding failed:", err.message);
    console.error(err.stack);
    throw err;
  } finally {
    await db.destroy();
  }
}

seed()
  .then(() => {
    console.log("✅ Done seeding");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

export default seed;
