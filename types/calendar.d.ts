import type { Area, Registration, RegistrationID } from '~/types/registration'

export type Day<T = RegistrationID | Registration> = {
  id?: number
  date: Date
  areas?: Area<T>[]
}

export type Month<T = RegistrationID | Registration> = {
  month: string
  dates: Day<T>[]
}

export type Calendar<T = RegistrationID | Registration> = Month<T>[]

export type AdminCalendar = Calendar<Registration>
