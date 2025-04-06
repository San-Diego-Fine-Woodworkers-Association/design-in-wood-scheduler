import { eachDayOfInterval, isMonday, isTuesday } from 'date-fns'
import { filter, map } from 'lodash-es'

export async function seed(knex) {
  // Deletes ALL existing entries
  await Promise.all([
    knex('registrations').del(),
    knex('time_slots').del(),
    knex('registration_types').del(),
    knex('fair_dates').del()
  ])

  await Promise.all([
    knex('registration_types').insert([
      { id: 1, type: 'Gallery Floor' },
      { id: 2, type: 'Chair Shop' }
    ]),
    knex('fair_dates').insert(
      filter(
        map(eachDayOfInterval({
          start: new Date('2025-06-12'),
          end: new Date('2025-07-12')
        }), (date, id) => ({ id, date })),
        ({ date }) => !isMonday(date) && !isTuesday(date)
      )
    )
  ])

  await knex('time_slots').insert([
    { id: 1, start_time: '11:00:00', end_time: '13:00:00', volunteer_count: 2, registration_type_id: 1 },
    { id: 2, start_time: '13:00:00', end_time: '16:00:00', volunteer_count: 2, registration_type_id: 1 },
    { id: 3, start_time: '16:00:00', end_time: '19:00:00', volunteer_count: 2, registration_type_id: 1 },
    { id: 4, start_time: '19:00:00', end_time: '22:00:00', volunteer_count: 2, registration_type_id: 1 },

    { id: 5, start_time: '12:00:00', end_time: '14:00:00', volunteer_count: 2, registration_type_id: 2 },
    { id: 6, start_time: '14:00:00', end_time: '16:00:00', volunteer_count: 2, registration_type_id: 2 },
    { id: 7, start_time: '16:00:00', end_time: '18:00:00', volunteer_count: 2, registration_type_id: 2 }
  ])
};
