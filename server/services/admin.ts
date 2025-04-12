import { map, uniq } from 'lodash-es'

import { getByIDs } from './user'
import { getCalendar as getFullCalendar } from './calendar'

import type { Calendar } from '~/types/calendar'

export async function getCalendar() {
  const calendar: Calendar = await getFullCalendar()

  const usersWithDups = []
  for (const { dates } of calendar) {
    for (const { areas = [] } of dates) {
      for (const { times } of areas) {
        for (const { registrations } of times) {
          usersWithDups.push(...map(registrations, ({ user: { id } }) => id))
        }
      }
    }
  }

  const uniqueUsers = uniq(usersWithDups)
  const usersByID = await getByIDs(uniqueUsers)

  return map(calendar, ({ dates, ...calendar }) => ({
    ...calendar,
    dates: map(dates, (date) => {
      if (!date.areas) return date

      return {
        ...date,
        areas: map(date.areas, ({ times, ...area }) => ({
          ...area,
          times: map(times, ({ registrations, ...time }) => ({
            ...time,
            registrations: map(registrations, registration => ({
              ...registration,
              user: usersByID[registration.user.id]
            }))
          }))
        }))
      }
    })
  }))
}
