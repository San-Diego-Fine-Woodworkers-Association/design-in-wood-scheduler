import { create } from '../../services/registration'
import type { User } from '#auth-utils'
import type { RegisterEvent } from '~/components/Registration/CalendarCell.vue'

export default defineEventHandler(async (event) => {
  const [body, { user: session }] = await Promise.all([
    readBody(event),
    requireUserSession(event)
  ])

  const { registration, user }: { registration: RegisterEvent, user: User['id'] } = body

  if (!session.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  await create(registration, user)
})
