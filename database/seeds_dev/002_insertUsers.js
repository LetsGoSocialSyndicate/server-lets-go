const { UUID_UNIVERSITY_OF_COLORADO, userTable } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(userTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(userTable).insert([
        {
          id: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4',
          first_name: 'Jane',
          middle_name: '',
          last_name: 'Doe',
          username: 'jane',
          email: 'jane.doe@email.com',
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'female',
          is_verified: true,
          birthday: '1999-01-01', 
          university_id: UUID_UNIVERSITY_OF_COLORADO
        }
      ])
    })
}
