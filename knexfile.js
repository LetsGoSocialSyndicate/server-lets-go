/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
'use strict'
const path = require('path')

module.exports = {
  development: {
    client: 'pg',
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds_dev')
    },
    connection: 'postgres://localhost/letsgo_dev'
  },

  test: {
    client: 'pg',
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds_dev')
    },
    connection: 'postgres://localhost/letsgo_test'
  },

  production: {
    client: 'pg',
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    },
    connection: process.env.DATABASE_URL
  }
}
