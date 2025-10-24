export async function up(knex) {
  await knex.schema.createTable("permissions", (table) => {
    table.increments("id").primary();
    table.string("name").unique().notNullable();
    table.string("description");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("permissions");
}
