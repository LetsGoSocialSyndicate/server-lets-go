/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { userTable, universityTable } = require('../services/constants')

// user roles: admin, normal
exports.up = (knex, Promise) => {
  return knex.schema.createTable(userTable, (table) => {
    table.uuid('id')
    table.varchar('first_name', 30).notNullable()
    table.varchar('middle_name', 30).notNullable().defaultTo('')
    table.varchar('last_name', 30).notNullable()
    table.varchar('email', 255).notNullable()
    table.varchar('role', 30).notNullable()
    table.dateTime('verified_at').nullable()
    table.date('birthday').notNullable()
    table.specificType('hashed_password', 'CHAR(60)')
    // Gender is optional, but we will filter by gender
    table.varchar('gender', 30).notNullable().defaultTo('')
    table.varchar('about', 200).notNullable().defaultTo('Describe yourself here...')

    table.uuid('university_id').notNullable()
    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(userTable, (table) => {
        table.unique('id')
        table.unique('email')
        // table.foreign('university_id').references('id').inTable(universityTable)
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(userTable)
}
