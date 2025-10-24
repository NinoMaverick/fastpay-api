export async function up(knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.index("user_id", "idx_payments_user_id");
    table.index("status", "idx_payments_status");
    table.index("reference", "idx_payments_reference");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("payments", (table) => {
    table.dropIndex("user_id", "idx_payments_user_id");
    table.dropIndex("status", "idx_payments_status");
    table.dropIndex("reference", "idx_payments_reference");
  });
}