import knex from 'knex'

const { POSTGRES_URL } = process.env

const db = knex({
  client: 'pg',
  connection: POSTGRES_URL
})

export default db
