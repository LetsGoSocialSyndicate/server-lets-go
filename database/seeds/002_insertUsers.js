/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { UUID_UNIVERSITY_OF_COLORADO, USER_ROLE_ADMIN, USER_ROLE_REGULAR, userTable } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(userTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(userTable).insert([
        {
          id: '67fe4da3-1a5f-44be-9e1a-c896509e7425',
          first_name: 'Sukmi',
          middle_name: '',
          last_name: 'Ledru',
          email: 'sukmi.ledru@gmail.com',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-19',
          birthday: '2000-07-15',
          hashed_password: '00b$08$AIz0pzMGdg/kxPdgQXsXG.ixLfRUbcYbW2vDHmtG1rd2bjd4lfZ5W',
          gender: 'female',
          about: 'Describe yourself here...',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-19 15:06:25.801173+00',
          updated_at: '2018-07-19 15:06:25.801173+00'
        },
        {
          id: '364f481c-c7d9-4ea1-9741-c71579efda68',
          first_name: 'Tommy',
          middle_name: '',
          last_name: 'Ziolkowski',
          email: 'ziolkowstr08@uww.edu',
          role: USER_ROLE_REGULAR,
          verified_at: '2018-07-19 00:00:00+00',
          birthday: '1993-06-08',
          hashed_password: '00b$08$1BxzqN1FZ0dHN87a46jWnemA28G5wXlqkJHOXzM7iyLnhgx9ca5B',
          gender: 'male',
          about: 'I’m an avid skier and cyclist who is studying accounting and finance. You can find me outside or at the library studying.',
          university_id: UUID_UNIVERSITY_OF_COLORADO,
          created_at: '2018-07-19 14:08:03.958573+00',
          updated_at: '2018-07-19 14:08:03.958573+00'
        }
      ])
    })
}
