declare module '#auth-utils' {
  interface User {
    email: string
    memberID: number
    isAdmin: boolean
    address: {
      street1?: string
      street2?: string
      city?: string
      state?: string
      postalCode?: string
    }
  }
}

export {}
