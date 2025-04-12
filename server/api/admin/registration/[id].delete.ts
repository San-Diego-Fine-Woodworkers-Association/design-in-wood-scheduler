import { toNumber } from 'lodash-es'
import { cancel } from '~/server/services/registration'

export default defineEventHandler(async (event) => {
  const { user: session } = await requireUserSession(event)

  const registrationID = getRouterParam(event, 'id')

  if (!session.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  await cancel(toNumber(registrationID))
})
