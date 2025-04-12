import { map, toNumber } from 'lodash-es'
import type { Calendar } from '~/types/calendar'

export default function (calendar: Calendar): Calendar {
  return map(calendar, ({ month, dates }) => ({
    month,
    dates: map(dates, ({ date, ...d }) => {
      const [year, month, day] = (date as unknown as string).split('-')
      return { ...d, date: new Date(toNumber(year), toNumber(month) - 1, toNumber(day)) }
    })
  }))
}
