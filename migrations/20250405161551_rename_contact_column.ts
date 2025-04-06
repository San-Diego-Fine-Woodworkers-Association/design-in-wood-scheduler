import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('registrations', (table) => {
    table.renameColumn('contact_id', 'user_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('registrations', (table) => {
    table.renameColumn('user_id', 'contact_id')
  })
}
