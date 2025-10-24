export function up(knex) {
  return knex.schema.createTable("payments", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.uuid("user_id").notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.string("currency", 10).notNullable();
    table.string("status").notNullable();
    table.string("reference").unique().notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("payments");
}
