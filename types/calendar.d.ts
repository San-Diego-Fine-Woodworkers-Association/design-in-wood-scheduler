import type { Area } from '~/types/registration'

export type Day = {
  id?: number
  date: Date
  areas?: Area[]
}

export type Month = {
  month: string
  dates: Day[]
}

export type Calendar = Month[]
