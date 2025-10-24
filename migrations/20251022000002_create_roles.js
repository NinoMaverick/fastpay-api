export async function up(knex) {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("name").unique().notNullable();
    table.string("description");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("roles");
}
