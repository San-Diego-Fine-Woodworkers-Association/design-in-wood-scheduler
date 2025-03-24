import type { Knex } from 'knex'

const { DATABASE_URL } = process.env

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: DATABASE_URL,
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
    connection: DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
