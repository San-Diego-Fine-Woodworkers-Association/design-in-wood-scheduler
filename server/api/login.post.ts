import { z } from 'zod'
import { login } from '../services/user'

const bodySchema = z.object({
  email: z.string().email()
})

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, bodySchema.parse)

  const user = await login(email)

  if (user) {
    await setUserSession(event, { user })
    return 'Success'
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'
  })
})
