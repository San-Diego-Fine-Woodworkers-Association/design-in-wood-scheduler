import { create } from '../services/registration'

export default defineEventHandler(async (event) => {
  const [body, { user }] = await Promise.all([
    readBody(event),
    requireUserSession(event)
  ])

  await create(body, user)
})
