export async function up(knex) {
  await knex.schema.createTable("role_permissions", (table) => {
    table.increments("id").primary();

    table
      .integer("role_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE")
      .index();

    table
      .integer("permission_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("permissions")
      .onDelete("CASCADE")
      .index();

    // Prevent duplicate role-permission pairs
    table.unique(["role_id", "permission_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("role_permissions");
}
