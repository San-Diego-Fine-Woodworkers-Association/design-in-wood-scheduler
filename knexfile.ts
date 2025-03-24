import type { Knex } from 'knex'

const { POSTGRES_URL } = process.env

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: POSTGRES_URL,
    pool: { min: 1, max: 10 },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './local/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: POSTGRES_URL,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
