/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(userTable, (table) => {
    table.uuid('id')
    table.varchar('first_name', 255).notNullable()
    table.varchar('middle_name', 255).notNullable().defaultTo('')
    table.varchar('last_name', 255).notNullable()
    table.varchar('username', 255).notNullable()
    table.varchar('email', 255).notNullable()
    table.specificType('hashed_password', 'CHAR(60)')
    // Gender is optional, but we will filter by gender
    table.varchar('gender', 255).notNullable().defaultTo('')
    // will add correct "type" and also defaultTo user_pic
    table.binary('image')
    table.text('about').notNullable().defaultTo('')
    // How fast user answers
    table.integer('avg_speed_min').notNullable().defaultTo(0)

    table.uuid('university_id').notNullable()
    table.foreign('university_id').references('id').inTable('universities')

    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(userTable, (table) => {
        table.unique('id')
        table.unique('email')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(userTable)
}
