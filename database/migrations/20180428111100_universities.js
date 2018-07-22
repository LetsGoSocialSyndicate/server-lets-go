/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { universityTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(universityTable, (table) => {
    table.uuid('id')
    table.varchar('name', 100).notNullable()
    table.varchar('email_domain', 30).notNullable()
    table.varchar('address', 255).notNullable().defaultTo('')
    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(universityTable, (table) => {
        table.unique('id')
      })
    })
}
exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(universityTable)
}
