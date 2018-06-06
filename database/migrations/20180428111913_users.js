/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { userTable, universityTable } = require('../services/constants')

// user roles: admin, normal
exports.up = (knex, Promise) => {
  return knex.schema.createTable(userTable, (table) => {
    table.uuid('id')
    table.varchar('first_name', 255).notNullable()
    table.varchar('middle_name', 255).notNullable().defaultTo('')
    table.varchar('last_name', 255).notNullable()
    table.varchar('email', 255).notNullable()
    table.varchar('role', 255).notNullable()
    table.dateTime('verified_at').nullable()
    table.date('birthday').notNullable()
    table.specificType('hashed_password', 'CHAR(60)')
    // Gender is optional, but we will filter by gender
    table.varchar('gender', 255).notNullable().defaultTo('')
    // will add correct "type" and also defaultTo user_pic
    table.text('image_url').defaultTo('http://akilezwebsolutions.com/wp-content/uploads/avatar-7.png')
    table.text('about').notNullable().defaultTo('Describe yourself here...')

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
