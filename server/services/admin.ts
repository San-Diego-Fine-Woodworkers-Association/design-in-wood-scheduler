import { list } from './registration'

export async function listRegistrations() {
  const registrations = await list()
}
