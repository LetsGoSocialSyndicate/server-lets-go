
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('universities').del()
    .then(() => {
      // Inserts seed entries
      return knex('universities').insert([
        {
          id: 'a8471c7a-16c4-480d-8c2b-ce05af92417d',
          name: 'University of Colorado'},
          email_domain: 'colorado.edu',
          address: 'Boulder, Colorado'
      ])
    })
}
