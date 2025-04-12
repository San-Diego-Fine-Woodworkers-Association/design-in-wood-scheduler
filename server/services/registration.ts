import { isNil, reduce } from 'lodash-es'

import db from '../clients/db'

import type { User } from '#auth-utils'
import type { RegisterEvent } from '~/components/Registration/CalendarCell.vue'
import type { Registration, RegistrationDetails } from '~/types/registration'

export async function create(
  registration: RegisterEvent,
  userID: User['id']
): Promise<Registration | undefined> {
  const [existingRegistration, isSlotFull] = await Promise.all([
    db.select('id')
      .from({ r: 'registrations' })
      .where('r.date_id', registration.dateID)
      .andWhere('r.time_slot_id', registration.area.time.id)
      .andWhere('r.user_id', userID)
      .first(),

    db.select({
      id: 't.id',
      maxVolunteerCount: 't.volunteer_count',
      volunteerCount: 'r.count'
    }).from({ t: 'time_slots' })
      .leftJoin({
        r: db.select('time_slot_id').from('registrations').where({
          date_id: registration.dateID, time_slot_id: registration.area.time.id
        }).groupBy('time_slot_id').count('time_slot_id', { as: 'count' }) as unknown as string
      }, 'r.time_slot_id', 't.id')
      .where('t.id', registration.area.time.id)
      .first()
      .then(({ maxVolunteerCount, volunteerCount }) => volunteerCount >= maxVolunteerCount)
  ])

  if (!isNil(existingRegistration) || isSlotFull) {
    throw createError({ statusCode: 409, statusMessage: 'Conflict' })
  }

  const newRegistration: { id: number }[] = await db.insert({
    date_id: registration.dateID,
    time_slot_id: registration.area.time.id,
    user_id: userID
  }).into('registrations')
    .returning('id')

  return {
    id: newRegistration[0].id,
    user: { id: userID }
  }
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

  return reduce(res, (acc: Record<number, RegistrationDetails[]>, { dateID, date, ...rest }) => {
    const registration = {
      id: rest.id,
      user: {
        id: rest.userID
      },
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

export async function cancel(registrationID: number, userID?: number): Promise<void> {
  const query = db('registrations').select('id').where({
    id: registrationID
  })

  if (userID) query.andWhere('user_id', userID)

  const count = await query.del()

  if (count === 0) throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
};
