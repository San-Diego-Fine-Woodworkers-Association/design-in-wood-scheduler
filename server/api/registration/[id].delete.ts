import { toNumber } from 'lodash-es'
import { cancel } from '~/server/services/registration'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const registrationID = getRouterParam(event, 'id')

  await cancel(toNumber(registrationID), user)
})
