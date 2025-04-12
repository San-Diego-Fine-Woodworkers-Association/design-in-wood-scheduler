export type TimeSlot = {
  id: number
  volunteerCount: number
  start: string
  end: string
  maxVolunteerCount: number
  registration?: RegistrationID
  registrations?: Registration[]
}

export type Area = {
  typeID: number
  typeName: string
  times: TimeSlot[]
}

export type RegistrationID = number
export type RegistrationDetails = {
  id: number
  user: {
    email?: string
    name?: string
    id: number
  }
  date: Date
  dateID: number
  area: Omit<Area, 'times'> & {
    time: {
      id: number
      start: string
      end: string
    }
  }
}
export type Registration = {
  id: number
  user: {
    email?: string
    name?: string
    id: number
  }
}
