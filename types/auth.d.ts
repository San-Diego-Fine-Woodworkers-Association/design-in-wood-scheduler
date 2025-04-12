declare module '#auth-utils' {
  interface User {
    name: string
    email: string
    id: number
    isAdmin?: boolean
    address?: {
      street1: string
      street2?: string | null
      city: string
      state: string
      postalCode: string
    }
  }
}

export {}
