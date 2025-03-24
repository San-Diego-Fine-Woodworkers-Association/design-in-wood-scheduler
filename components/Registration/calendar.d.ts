import type { TimeSlot, Area } from '~/server/services/calendar'

export type Registration = {
  date: Date
  dateID: number
  area: Omit<Area, 'times'> & {
    time: TimeSlot
  }
}
