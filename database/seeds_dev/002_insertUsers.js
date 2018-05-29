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
          hashed_password: '$2a$10$PD1unSwYylML0GGAExsWfOwHsUUNGNO3DG0fZm2FJaS5s0Ul44WSC',
          gender: 'female',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        }
      ])
    })
}
