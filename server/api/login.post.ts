import { z } from 'zod'
import { toNumber } from 'lodash-es'
import { login } from '../services/user'

const bodySchema = z.object({
  email: z.string().email(),
  memberID: z.string()
})

export default defineEventHandler(async (event) => {
  const { email, memberID } = await readValidatedBody(event, bodySchema.parse)

  const user = await login(email, toNumber(memberID))

  if (user) {
    await setUserSession(event, { user })
    return 'Success'
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'
  })
})
