/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { tokenTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(tokenTable, (table) => {
    table.varchar('username', 255).notNullable()
    table.varchar('token', 256).notNullable()
    table.timestamps(true, true)
  })
  .then(() => {
    return knex.schema.alterTable(tokenTable, (table) => {
      table.unique('token')
    })
  })
}
exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(tokenTable)
}
