import { find, first, groupBy, isArray, last, map, mapValues, mergeWith, orderBy, reduce, toNumber, toPairs, values } from 'lodash-es'
import { eachDayOfInterval, format, isEqual } from 'date-fns'

import type { Knex } from 'knex'
import db from '../clients/db'

export type TimeSlot = {
  id: number
  start: string
  end: string
  volunteerCount: number
  maxVolunteerCount: number
  registrationID?: number
}

export type Area = {
  typeID: number
  typeName: string
  times: TimeSlot[]
}

export type FairDate = {
  id: number
  date: Date
  areas: Area[]
}

type AccFairDate = {
  id: number
  date: Date
  areas: Record<number, Area>
}

export type CalendarDate = Partial<FairDate> & {
  date: Date
}

export type CalendarMonth = {
  month: string
  dates: CalendarDate[]
}

type TimeSlotRow = {
  timeSlotID: number
  timeSlotTypeID: number
  timeSlotTypeName: string
  timeSlotStart: string
  timeSlotEnd: string
  timeSlotVolunteerCount?: string
  timeSlotMaxVolunteerCount: number
  registrationID?: number
}

type DatesAndSlotsRow = Partial<TimeSlotRow> & {
  date: Date
  dateID: number
}

export const getFairDates = async (memberID?: number): Promise<FairDate[]> => {
  const timeSlotVolunteerCount = db.select('time_slot_id', 'date_id')
    .count({ volunteer_count: '*' })
    .from('registrations')
    .groupBy('time_slot_id', 'date_id')

  const membersRegistrations = db.select('id', 'time_slot_id', 'date_id')
    .from('registrations')
    .where(memberID ? { member_id: memberID } : false)

  const datesAndSlots: DatesAndSlotsRow[] = await db.select({
    dateID: 'd.id',
    date: 'd.date',
    timeSlotID: 't.id',
    timeSlotTypeID: 'rt.id',
    timeSlotTypeName: 'rt.type',
    timeSlotStart: 't.start_time',
    timeSlotEnd: 't.end_time',
    timeSlotVolunteerCount: 'vc.volunteer_count',
    timeSlotMaxVolunteerCount: 't.volunteer_count',
    registrationID: 'mr.id'
  }).from({ d: 'fair_dates' })
    .crossJoin({ t: 'time_slots' } as unknown as Knex.Raw)
    .leftJoin({ rt: 'registration_types' }, 'rt.id', 't.registration_type_id')
    .leftJoin({ vc: timeSlotVolunteerCount } as unknown as Knex.Raw, (join) => {
      join.on('vc.time_slot_id', 't.id').andOn('vc.date_id', 'd.id')
    })
    .leftJoin({ mr: membersRegistrations } as unknown as Knex.Raw, (join) => {
      join.on('mr.time_slot_id', 't.id')
        .andOn('mr.date_id', 'd.id')
    })
    .orderBy([
      { column: 'd.date', order: 'asc' },
      { column: 'timeSlotStart', order: 'asc' }
    ])

  const dates = reduce(datesAndSlots, (acc: Record<number, AccFairDate>, { dateID, date, ...rest }) => {
    const timeSlot = rest.timeSlotID
      ? {
          id: rest.timeSlotID,
          start: rest.timeSlotStart!,
          end: rest.timeSlotEnd!,
          volunteerCount: toNumber(rest.timeSlotVolunteerCount) || 0,
          maxVolunteerCount: rest.timeSlotMaxVolunteerCount!,
          registrationID: rest.registrationID
        }
      : null

    const area = rest.timeSlotTypeID
      ? {
          [rest.timeSlotTypeID]: {
            typeID: rest.timeSlotTypeID!,
            typeName: rest.timeSlotTypeName!,
            times: timeSlot ? [timeSlot] : []
          }
        }
      : {}

    if (acc[dateID]) {
      mergeWith(acc[dateID].areas, area, (obj, src) => isArray(obj) ? obj.concat(src) : undefined)
    }
    else {
      acc[dateID] = { id: dateID, date, areas: area || {} }
    }

    return acc
  }, {})

  const fairDates = mapValues(dates, ({ areas, ...date }) => ({
    ...date,
    areas: orderBy(values(mapValues(areas, ({ times, ...slotType }) => ({
      ...slotType,
      times: orderBy(times, 'start', 'asc')
    }))), 'typeName', 'asc')
  }))

  return orderBy(values(fairDates), 'date', 'asc')
}

export const getCalendar = async (memberID?: number): Promise<CalendarMonth[]> => {
  const fairDates = await getFairDates(memberID)

  const firstDay = first(fairDates)!
  const lastDay = last(fairDates)!

  const allDays = map(eachDayOfInterval({ start: firstDay.date, end: lastDay.date }), (date) => {
    const fairDate = find(fairDates, d => isEqual(d.date, date))
    return { ...fairDate, date }
  })

  const months = groupBy(allDays, (calendarDate: CalendarDate) => format(calendarDate.date, 'MMMM'))

  return map(toPairs(months), ([month, dates]) => ({ month, dates }))
}
