const { eventTable } = require('../services/constants')

exports.seed = (knex, Promise) => { // eslint-disable-line no-unused-vars
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
          description: '',
          start_time: '2018-07-19 04:30:00',
          end_time: '2018-07-19 20:30:00'
        },
        {
          id: '5f216055-5e40-4146-8c27-91edfb608d26',
          title: 'Around the Town',
          location: 'Denver, CO',
          category: 'bicycle',
          description: '',
          start_time: '2018-07-20 07:30:00',
          end_time: '2018-07-20 12:30:00'
        },
        {
          id: '4d432e4c-e2ba-4244-b648-9237c168dea9',
          title: 'Table Mesa Trail',
          location: 'Boulder, CO',
          category: 'hike',
          description: '',
          start_time: '2018-07-19 06:30:00',
          end_time: '2018-07-19 12:30:00'
        },
        {
          id: '3834e6af-f22a-4a94-a264-c3b8d9ed259e',
          title: 'Follow the Creek',
          location: 'Boulder, CO',
          category: 'jog',
          description: '',
          start_time: '2018-07-19 06:00:00',
          end_time: '2018-07-19 08:00:00'
        },
        {
          id: '5db5b970-f789-4e9e-b322-b10b70a6a6c3',
          title: 'Jog around REI',
          location: 'REI, Denver, CO',
          category: 'jog',
          description: '',
          start_time: '2018-07-19 07:30:00',
          end_time: '2018-07-19 09:00:00'
        },
        {
          id: 'd5722a6b-4df3-4b68-ad80-851d5797ab85',
          title: 'Pickup Game',
          location: 'SBRC, Boulder, CO',
          category: 'basket ball pickup game',
          description: '',
          start_time: '2018-07-19 18:30:00',
          end_time: '2018-07-19 20:30:00'
        },
        {
          id: '28327a4a-5513-4eca-8663-efc3fefe8bbe',
          title: 'Flag Football',
          location: 'SBRC, Boulder, CO',
          category: 'flag football',
          description: '',
          start_time: '2018-07-19 08:00:00',
          end_time: '2018-07-19 10:00:00'
        },
        {
          id: 'a44e7a37-3846-43ae-accd-0c382e9488ec',
          title: 'Soccer',
          location: 'Erie Middle School',
          category: 'soccer',
          description: '',
          start_time: '2018-07-21 10:30:00',
          end_time: '2018-07-21 12:00:00'
        },
        {
          id: '81c84717-9144-427f-9ce3-ffc2bd841df7',
          title: 'Moab',
          location: 'Moab, UT',
          category: 'mountain biking',
          description: '',
          start_time: '2018-07-20 05:30:00',
          end_time: '2018-07-20 23:30:00'
        },
        {
          id: '487df22d-4c82-41da-a943-340bf104013e',
          title: 'Copper',
          location: 'Copper Mountain, CO',
          category: 'skiing',
          description: '',
          start_time: '2018-07-19 05:30:00',
          end_time: '2018-07-19 22:30:00'
        },
        {
          id: 'c57af163-04a6-40a2-9d9e-2861f3d3a7b7',
          title: 'Pike\'s Peak',
          location: 'Colorado Springs',
          category: 'cycling',
          description: '',
          start_time: '2018-07-18 06:30:00',
          end_time: '2018-07-18 20:30:00'
        },
        {
          id: '6cc6b661-31eb-4ede-8185-b7b592c450c2',
          title: 'Jump',
          location: 'Jump City',
          category: 'Party',
          description: 'simply jump',
          start_time: '2018-09-26 07:51:00',
          end_time: '2018-09-28 07:51:00'
        }
      ])
    })
}
