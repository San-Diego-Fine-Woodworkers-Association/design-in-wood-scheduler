import { map } from 'lodash-es'
import { format } from 'date-fns'

import { getCalendar } from '../services/calendar'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const months = await getCalendar(user?.id)

  return {
    months,

    toJSON() {
      return map(months, ({ dates, ...month }) => ({
        ...month,
        dates: map(dates, ({ date, ...d }) => ({
          date: format(date, 'yyyy-MM-dd'),
          ...d
        }))
      }))
    }
  }
})
