import { isEmpty } from 'lodash-es'

import db from '../clients/db'

import type { User } from '#auth-utils'
import type { Registration } from '~/components/Registration/calendar'

export async function create(
  { dateID, area }: Registration, user: User
): Promise<{ id: number } | undefined> {
  const existingRegistration = await db.select('id', 'member_id')
    .from({ r: 'registrations' })
    .where('r.date_id', dateID)
    .andWhere('r.time_slot_id', area.time.id)

  if (!isEmpty(existingRegistration)) {
    if (existingRegistration[0].member_id === user.memberID) return

    throw createError({ statusCode: 409, statusMessage: 'Conflict' })
  }

  const registration: { id: number } = await db.insert({
    date_id: dateID,
    time_slot_id: area.time.id,
    member_id: user.memberID
  }).into('registrations')
    .returning('id')

  return registration
}

export async function cancel(registrationID: number, user: User) {
  const count = await db('registrations').select('id').where({
    id: registrationID,
    member_id: user.memberID
  }).del()

  if (count === 0) throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
};
