import { getCalendar } from '../services/calendar'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  return getCalendar(user?.id)
})
