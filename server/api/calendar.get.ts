import SuperJSON from 'superjson'

import type { CalendarMonth } from '../services/calendar'

import { getCalendar } from '../services/calendar'

export type GetCalendarResponse = {
  months: CalendarMonth[]
}

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const months = await getCalendar(user?.memberID)

  const data = {
    months,

    toJSON() {
      return this
    }
  }

  return SuperJSON.stringify(data) as unknown as typeof data
})
