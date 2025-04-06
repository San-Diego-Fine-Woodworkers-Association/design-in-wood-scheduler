import { isEmpty, reduce } from 'lodash-es'

import db from '../clients/db'

import type { User } from '#auth-utils'
import type { Registration } from '~/types/registration'

export async function create(
  { dateID, area }: Registration, user: User
): Promise<{ id: number } | undefined> {
  const existingRegistration = await db.select('id', 'user_id')
    .from({ r: 'registrations' })
    .where('r.date_id', dateID)
    .andWhere('r.time_slot_id', area.time.id)

  if (!isEmpty(existingRegistration)) {
    if (existingRegistration[0].user_id === user.id) return

    throw createError({ statusCode: 409, statusMessage: 'Conflict' })
  }

  const registration: { id: number } = await db.insert({
    date_id: dateID,
    time_slot_id: area.time.id,
    user_id: user.id
  }).into('registrations')
    .returning('id')

  return registration
}

export async function list(user?: User) {
  const query = db.select({
    id: 'r.id',
    userID: 'r.user_id',
    dateID: 'd.id',
    date: 'd.date',
    timeSlotID: 't.id',
    timeSlotTypeID: 'rt.id',
    timeSlotTypeName: 'rt.type',
    timeSlotStart: 't.start_time',
    timeSlotEnd: 't.end_time'
  }).from({ r: 'registrations' })
    .leftJoin({ d: 'fair_dates' }, 'd.id', 'r.date_id')
    .leftJoin({ t: 'time_slots' }, 't.id', 'r.time_slot_id')
    .leftJoin({ rt: 'registration_types' }, 'rt.id', 't.registration_type_id')

  if (user) query.where('r.user_id', user.id)

  const res = await query

  return reduce(res, (acc: Record<number, Registration[]>, { dateID, date, ...rest }) => {
    const registration = {
      id: rest.id,
      userID: rest.userID,
      date,
      dateID,
      area: {
        typeID: rest.timeSlotTypeID,
        typeName: rest.timeSlotTypeName,
        time: {
          id: rest.timeSlotID,
          start: rest.timeSlotStart,
          end: rest.timeSlotEnd
        }
      }
    }

    if (acc[dateID]) {
      acc[dateID].push(registration)
    }
    else {
      acc[dateID] = [registration]
    }

    return acc
  }, {})
}

export async function cancel(registrationID: number, user: User): Promise<void> {
  const count = await db('registrations').select('id').where({
    id: registrationID,
    user_id: user.id
  }).del()

  if (count === 0) throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
};
