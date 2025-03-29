import { isEmpty } from 'lodash-es'

import db from '../clients/db'

import type { User } from '#auth-utils'
import type { Registration } from '~/components/Registration/calendar'

export async function create(
  { dateID, area }: Registration, user: User
): Promise<{ id: number } | undefined> {
  const existingRegistration = await db.select('id', 'contact_id')
    .from({ r: 'registrations' })
    .where('r.date_id', dateID)
    .andWhere('r.time_slot_id', area.time.id)

  if (!isEmpty(existingRegistration)) {
    if (existingRegistration[0].contact_id === user.contactID) return

    throw createError({ statusCode: 409, statusMessage: 'Conflict' })
  }

  const registration: { id: number } = await db.insert({
    date_id: dateID,
    time_slot_id: area.time.id,
    contact_id: user.contactID
  }).into('registrations')
    .returning('id')

  return registration
}

export async function cancel(registrationID: number, user: User) {
  const count = await db('registrations').select('id').where({
    id: registrationID,
    contact_id: user.contactID
  }).del()

  if (count === 0) throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
};
