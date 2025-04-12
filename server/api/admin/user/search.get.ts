import { toNumber } from 'lodash-es'
import { search } from '~/server/services/user'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user?.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const params = getQuery(event)

  if (!params.q) throw createError({ statusCode: 400, statusMessage: 'Param q is required' })

  const users = await search(`${params.q}`, params.limit ? toNumber(params.limit) : undefined)

  return users
})
