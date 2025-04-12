import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_attributes', (table) => {
    table.integer('user_id').notNullable().unique()
    table.boolean('is_admin').defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_attributes')
}
