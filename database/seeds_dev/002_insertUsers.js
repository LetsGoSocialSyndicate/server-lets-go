const { UUID_UNIVERSITY_OF_COLORADO, USER_ROLE_ADMIN, USER_ROLE_REGULAR, userTable } = require('../services/constants')

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
          username: 'jane.doe@email.com',
          email: 'jane.doe@email.com',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'female',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: 'd7ff1352-305b-4f25-8104-062646ef9eb4',
          first_name: 'John',
          middle_name: '',
          last_name: 'Doe',
          username: 'john.doe@email.com',
          email: 'john.doe@email.com',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'male',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        },
        {
          id: 'e02ea500-0f47-4ea5-9031-f55d0b536708',
          first_name: 'Sam',
          middle_name: '',
          last_name: 'Smith',
          username: 'sam.smith@email.com',
          email: 'sam.smith@email.com',
          role: USER_ROLE_REGULAR,
          hashed_password: '$2b$10$uh0Y5nzAA80lZHQZEc6uzeeI5UDB.TPScJ/6T/OMdTSMzzGSSBPhm',
          gender: 'male',
          birthday: '1999-01-01',
          university_id: UUID_UNIVERSITY_OF_COLORADO
        }
      ])
    })
}
