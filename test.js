import { keyBy } from 'lodash-es'
// import knex from 'knex'

// const db = knex({
//   client: 'pg',
//   connection: 'postgres://diwdemo:diwdemo@localhost:5432/diw-demo'
// })

// function getTimeSlots() {
//   return db.select({
//     id: 't.id',
//     typeID: 'rt.id',
//     typeName: 'rt.type',
//     start: 't.start_time',
//     end: 't.end_time',
//     maxVolunteerCount: 't.volunteer_count'
//   }).from({ t: 'time_slots' })
//     .leftJoin({ rt: 'registration_types' }, 'rt.id', 't.registration_type_id')
//     .orderBy([
//       { column: 't.start_time', order: 'asc' },
//       { column: 'rt.id' }
//     ])
// }

(async () => {
  // const slots = await getTimeSlots()
  // console.log(slots)

  const vals = keyBy([{
    id: 1,
    date: new Date('2023-04-05')
  }, {
    id: 2,
    date: new Date('2023-04-06')
  }], ({ date }) => date.getTime())

  console.log(JSON.stringify(vals))
})()
