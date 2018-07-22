/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { eventTable, userTable } = require('../services/constants')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(eventTable, (table) => {
    table.uuid('id')
    table.string('title', 30).notNullable()
    table.string('location', 30).notNullable()
    table.string('icon_url', 255).notNullable().defaultTo('https://dtkp6g0samjql.cloudfront.net/uploads/photo/file/12571356/gallery_hero_fd7e2c1a-8970-4187-814e-5a77a1717f1e.jpg')
    table.string('category', 30).notNullable().defaultTo('')
    table.string('description', 200).notNullable().defaultTo('')
    table.dateTime('start_time').notNullable().defaultTo(knex.raw('now()'))
    table.dateTime('end_time').notNullable().defaultTo(knex.raw('now()'))
    table.timestamps(true, true)
  })
    .then(() => {
      return knex.schema.alterTable(eventTable, (table) => {
        table.unique('id')
      })
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists(eventTable)
}
