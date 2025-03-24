import knex from 'knex'

const { DATABASE_URL } = process.env

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})

export default db
