import type { Knex } from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('fair_dates', (table) => {
    table.increments('id').notNullable().unique()
    table.date('date').notNullable()
  }).createTable('registration_types', (table) => {
    table.increments('id').notNullable().unique()
    table.string('type').notNullable()
  }).createTable('time_slots', (table) => {
    table.increments('id').notNullable().unique()
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.integer('volunteer_count').notNullable()
    table.integer('registration_type_id').unsigned().notNullable()

    table.foreign('registration_type_id').references('id').inTable('registration_types')
  }).createTable('registrations', (table) => {
    table.increments('id').notNullable().unique()
    table.integer('date_id').unsigned().notNullable()
    table.integer('time_slot_id').unsigned().notNullable()
    table.integer('member_id').unsigned().notNullable()

    table.foreign('date_id').references('id').inTable('fair_dates')
    table.foreign('time_slot_id').references('id').inTable('time_slots')
  })
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTableIfExists('registrations')
    .dropTableIfExists('time_slots')
    .dropTableIfExists('registration_types')
    .dropTableIfExists('fair_dates')
}
