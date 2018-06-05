
const { userEventTable } = require('../services/constants')

exports.up = function(knex, Promise) {

//   table.dateTime('rated_at').notNullable().defaultTo(knex.raw('now()'))
//
//   table.uuid('rated_by').notNullable()
//   table.foreign('rated_by').references('id').inTable(userTable).onDelete('cascade')
};

exports.down = function(knex, Promise) {

};
