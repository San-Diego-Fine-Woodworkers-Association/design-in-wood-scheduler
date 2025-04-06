import { find, first, groupBy, keyBy, last, map, mapValues, reduce, toPairs, values } from 'lodash-es'
import { eachDayOfInterval, format } from 'date-fns'

import db from '../clients/db'
import type { Calendar } from '~/types/calendar'

type DateRow = { id: number, date: Date }
function getDates(): Promise<DateRow[]> {
  return db.select({
    id: 'd.id',
    date: 'd.date'
  }).from({ d: 'fair_dates' })
    .orderBy('d.date', 'asc')
}

type TimeSlotRow = { id: number, typeID: number, typeName: string, start: string, end: string, maxVolunteerCount: number }
function getTimeSlots(): Promise<TimeSlotRow[]> {
  return db.select({
    id: 't.id',
    typeID: 'rt.id',
    typeName: 'rt.type',
    start: 't.start_time',
    end: 't.end_time',
    maxVolunteerCount: 't.volunteer_count'
  }).from({ t: 'time_slots' })
    .leftJoin({ rt: 'registration_types' }, 'rt.id', 't.registration_type_id')
    .orderBy([
      { column: 't.start_time', order: 'asc' },
      { column: 'rt.id' }
    ])
}

type RegistrationRow = { id: number, userID: number, timeSlotID: number, dateID: number }
function getRegistrations(userID?: number): Promise<RegistrationRow[]> {
  const query = db.select({
    id: 'r.id',
    userID: 'r.user_id',
    timeSlotID: 'time_slot_id',
    dateID: 'date_id'
  }).from({ r: 'registrations' })

  if (userID) query.where('r.user_id', userID)
  return query
}

export async function getCalendar(userID?: number): Promise<Calendar> {
  const [dates, timeSlots, registrations] = await Promise.all([getDates(), getTimeSlots(), getRegistrations(userID)])

  const datesByDate = keyBy(dates, ({ date }) => date.getTime())
  const timeSlotsByTypeID = reduce(timeSlots, (acc: {
    [key: number]: { typeID: number, typeName: string, times: Omit<TimeSlotRow, 'typeID' | 'typeName'>[] }
  }, { typeID, typeName, ...time }) => {
    if (acc[typeID]) acc[typeID].times.push(time)
    else acc[typeID] = { typeID, typeName, times: [time] }

    return acc
  }, {})
  const registrationsByDateAndTimeSlotID = groupBy(registrations, ({ dateID, timeSlotID }) => `${dateID}__${timeSlotID}`)

  const firstDay = first(dates)!.date
  const lastDay = last(dates)!.date
  const allDays = eachDayOfInterval({ start: firstDay, end: lastDay })

  const getRegistrationDetails = (dateID: number, timeSlotID: number): { registration: number | undefined } | { registrations: number[] } => userID
    ? ({
        registration: find(registrationsByDateAndTimeSlotID[`${dateID}__${timeSlotID}`], ['userID', userID])?.id
      })
    : ({
        registrations: map(registrationsByDateAndTimeSlotID[`${dateID}__${timeSlotID}`] || [], 'id')
      })

  const mappedDays = map(allDays, (date) => {
    const fairDate = datesByDate[date.getTime()]
    if (!fairDate) return { date }

    return {
      ...fairDate,
      areas: values(mapValues(timeSlotsByTypeID, ({ times, ...area }) => ({
        ...area,
        times: map(times, ({ id, ...time }) => ({
          id,
          ...time,
          ...getRegistrationDetails(fairDate.id, id),
          volunteerCount: registrationsByDateAndTimeSlotID[`${fairDate.id}__${id}`]?.length || 0
        }))
      })))
    }
  })

  const months = groupBy(mappedDays, ({ date }) => format(date, 'MMMM'))

  return map(toPairs(months), ([month, dates]) => ({ month, dates }))
}
