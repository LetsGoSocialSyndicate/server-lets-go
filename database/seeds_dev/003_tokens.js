const { tokenTable } = require('../services/constants')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(tokenTable).del()
    .then(function() {
      // Inserts seed entries
      return knex(tokenTable).insert([
        {
          email: 'email',
          token: 'token'
        }
      ])
  })
}
