export type PCAddress = {
  AddressId: number
  IsPrimary: boolean
  StreetAddress1: string
  StreetAddress2: string | null
  City: string
  State: {
    Name: string
    Abbreviation: string
  }
  PostalCode: string
}

export type PCContact = {
  ContactId: number
  FirstName: string
  LastName: string
  HomePhone: string
  WorkPhone: string
  WorkPhoneExtension: string
  Mobile: string
  Email: string
  Addresses: PCAddress[]
}
