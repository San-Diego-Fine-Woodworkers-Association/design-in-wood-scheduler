import { map } from 'lodash-es'
import { format } from 'date-fns'

import { getCalendar } from '../../services/admin'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user?.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const months = await getCalendar()

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
