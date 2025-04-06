export type TimeSlot<T = RegistrationID | Registration> = {
  id: number
  volunteerCount: number
  start: string
  end: string
  maxVolunteerCount: number
  registration?: RegistrationID
  registrations?: T[]
}

export type Area<T = RegistrationID | Registration> = {
  typeID: number
  typeName: string
  times: TimeSlot<T>[]
}

export type RegistrationID = number
export type Registration = {
  id: number
  user: {
    email: string
    name: string
    id: number
  }
  dateID: number
  typeID: number
  timeSlotID: number
}
