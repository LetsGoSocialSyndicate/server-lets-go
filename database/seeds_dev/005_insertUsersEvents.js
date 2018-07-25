/*
 * Copyright 2018, Socializing Syndicate Corp.
 */
const { userEventTable } = require('../services/constants')

exports.seed = (knex, Promise) => { // eslint-disable-line no-unused-vars
  // Deletes ALL existing entries
  return knex(userEventTable).del()
    .then(() => {
      // Inserts seed entries
      return knex(userEventTable).insert([
        { // organizer
          id: '51d3c35f-c338-4830-9d68-fb0c432b4318',
          event_id: '12755681-a2f0-44ed-b8e3-4282935c472a',
          posted_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // participant
          id: '9859a311-37fb-4025-a725-14e76d8dc342',
          event_id: '12755681-a2f0-44ed-b8e3-4282935c472a',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '4eea98b2-b0dc-4faa-a771-629259db5bbc',
          event_id: '12755681-a2f0-44ed-b8e3-4282935c472a',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // organizer
          id: '75c1dff9-76e2-46c8-827a-70f3f3eb6816',
          event_id: '5f216055-5e40-4146-8c27-91edfb608d26',
          posted_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // participant
          id: 'cdd8f813-dd62-4770-b09a-378b36ac9947',
          event_id: '5f216055-5e40-4146-8c27-91edfb608d26',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '115ec728-1b77-4ab1-8552-5e1de44c7f25',
          event_id: '5f216055-5e40-4146-8c27-91edfb608d26',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // organizer
          id: '3c313ee0-3a27-4747-827f-b7fded026a63',
          event_id: '4d432e4c-e2ba-4244-b648-9237c168dea9',
          posted_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // participant
          id: 'bd2a8bcb-d60f-4fe0-9ccf-5c69bbba6b09',
          event_id: '4d432e4c-e2ba-4244-b648-9237c168dea9',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '89330d6d-a5fe-4482-bd38-baa684128928',
          event_id: '4d432e4c-e2ba-4244-b648-9237c168dea9',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // organizer
          id: 'aca7d79f-bc2b-4fb6-ae93-2d6f39849032',
          event_id: '3834e6af-f22a-4a94-a264-c3b8d9ed259e',
          posted_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: 'dc66bcf3-5447-4507-86e3-0a5e3652d950',
          event_id: '3834e6af-f22a-4a94-a264-c3b8d9ed259e',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: 'ae0e5f30-fda7-4568-aeb6-c7223c7e853a',
          event_id: '3834e6af-f22a-4a94-a264-c3b8d9ed259e',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'faf3078e-4d3f-45af-bb61-44c2051a742b',
          event_id: '5db5b970-f789-4e9e-b322-b10b70a6a6c3',
          posted_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '4449ac04-fcbd-4181-8e58-06b9e0b23fa5',
          event_id: '5db5b970-f789-4e9e-b322-b10b70a6a6c3',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: '945bb4c8-3ed6-4c97-a9d2-702d9193c4f2',
          event_id: '5db5b970-f789-4e9e-b322-b10b70a6a6c3',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'b061ba7a-a04e-41fd-9187-319e56d8206a',
          event_id: 'd5722a6b-4df3-4b68-ad80-851d5797ab85',
          posted_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: 'f760c78f-61e9-4aab-87d9-22fd2b0dc121',
          event_id: 'd5722a6b-4df3-4b68-ad80-851d5797ab85',
          requested_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: '218ab6f6-aaf7-4a56-bb2e-548c7d2d0d8a',
          event_id: 'd5722a6b-4df3-4b68-ad80-851d5797ab85',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'c682bb9b-bfc4-46ab-a2e9-40031514863e',
          event_id: '28327a4a-5513-4eca-8663-efc3fefe8bbe',
          posted_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: '492848fb-8fce-4f74-b325-c19bae45a3b6',
          event_id: '28327a4a-5513-4eca-8663-efc3fefe8bbe',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '9ae12d17-f6f4-4337-87d7-9b9f3a54bda3',
          event_id: '28327a4a-5513-4eca-8663-efc3fefe8bbe',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'e7dc6df8-1337-43ae-b2e5-337452b870c9',
          event_id: 'a44e7a37-3846-43ae-accd-0c382e9488ec',
          posted_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: '4e93d583-5971-489e-958b-2862282f32b6',
          event_id: 'a44e7a37-3846-43ae-accd-0c382e9488ec',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: '9726c6b1-e547-4a96-be55-43a0c386b945',
          event_id: 'a44e7a37-3846-43ae-accd-0c382e9488ec',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'bee1bf8e-a653-4248-a939-54110f90bcaf',
          event_id: '81c84717-9144-427f-9ce3-ffc2bd841df7',
          posted_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // participant
          id: '3265f904-e794-4b01-8880-6eca47fb0825',
          event_id: '81c84717-9144-427f-9ce3-ffc2bd841df7',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: 'b490b326-f891-44fd-be63-dcbd11facbf0',
          event_id: '81c84717-9144-427f-9ce3-ffc2bd841df7',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: '6623e81a-c3eb-41d5-8fd1-257e4614d9e2',
          event_id: '487df22d-4c82-41da-a943-340bf104013e',
          posted_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: '7c03a58f-7d15-4cc6-9d08-f6fd766ce016',
          event_id: '487df22d-4c82-41da-a943-340bf104013e',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: 'd0563a94-3abb-4b7a-8a97-2a0967ed071e',
          event_id: '487df22d-4c82-41da-a943-340bf104013e',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'efb4dde1-cc9f-4c7f-92ac-af78545a2abc',
          event_id: 'c57af163-04a6-40a2-9d9e-2861f3d3a7b7',
          posted_by: 'e02ea500-0f47-4ea5-9031-f55d0b536708'
        },
        { // participant
          id: 'd1f411cd-8c6f-4f9a-b1fb-121161fc17ff',
          event_id: 'c57af163-04a6-40a2-9d9e-2861f3d3a7b7',
          requested_by: 'd7ff1352-305b-4f25-8104-062646ef9eb4'
        },
        { // participant
          id: 'bf844f89-5320-4edc-baa8-b27dc727f59c',
          event_id: 'c57af163-04a6-40a2-9d9e-2861f3d3a7b7',
          requested_by: '8ed01d49-b0c7-4a4b-941a-fad2c346d9b4'
        },
        { // organizer
          id: 'b192abb6-cd5a-46bd-87a4-9163113ba916',
          event_id: '6cc6b661-31eb-4ede-8185-b7b592c450c2',
          posted_by: 'a9e6d36c-9ecb-408a-a4e4-e5893fa4154d'
        }
      ])
    })
}
