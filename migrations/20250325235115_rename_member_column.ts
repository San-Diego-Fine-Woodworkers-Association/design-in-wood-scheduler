import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('registrations', (table) => {
    table.renameColumn('member_id', 'contact_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('registrations', (table) => {
    table.renameColumn('contact_id', 'member_id')
  })
}
