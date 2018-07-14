const { eventTable } = require('../services/constants')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex(eventTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(eventTable).insert([
        {
          id: '12755681-a2f0-44ed-b8e3-4282935c472a',
          title: 'Road Warriors',
          location: 'Boulder, CO',
          category: 'bicycle',
          description: ''
        },
        {
          id: '5f216055-5e40-4146-8c27-91edfb608d26',
          title: 'Around the Town',
          location: 'Denver, CO',
          category: 'bicycle',
          description: ''
        },
        {
          id: '4d432e4c-e2ba-4244-b648-9237c168dea9',
          title: 'Table Mesa Trail',
          location: 'Boulder, CO',
          category: 'hike',
          description: ''
        },
        {
          id: '3834e6af-f22a-4a94-a264-c3b8d9ed259e',
          title: 'Follow the Creek',
          location: 'Boulder, CO',
          category: 'jog',
          description: ''
        },
        {
          id: '5db5b970-f789-4e9e-b322-b10b70a6a6c3',
          title: 'Jog around REI',
          location: 'REI, Denver, CO',
          category: 'jog',
          description: ''
        },
        {
          id: 'd5722a6b-4df3-4b68-ad80-851d5797ab85',
          title: 'Pickup Game',
          location: 'SBRC, Boulder, CO',
          category: 'basket ball pickup game',
          description: ''
        },
        {
          id: '28327a4a-5513-4eca-8663-efc3fefe8bbe',
          title: 'Flag Football',
          location: 'SBRC, Boulder, CO',
          category: 'flag football',
          description: ''
        },
        {
          id: 'a44e7a37-3846-43ae-accd-0c382e9488ec',
          title: 'Soccer',
          location: 'Erie Middle School, Erie, CO',
          category: 'soccer',
          description: ''
        },
        {
          id: '81c84717-9144-427f-9ce3-ffc2bd841df7',
          title: 'Moab',
          location: 'Moab, UT',
          category: 'mountain biking',
          description: ''
        },
        {
          id: '487df22d-4c82-41da-a943-340bf104013e',
          title: 'Copper',
          location: 'Copper Mountain, CO',
          category: 'skiing',
          description: ''
        },
        {
          id: 'c57af163-04a6-40a2-9d9e-2861f3d3a7b7',
          title: 'Pike\'s Peak',
          location: 'Colorado Springs',
          category: 'cycling',
          description: ''
        }
      ])
    })
}
