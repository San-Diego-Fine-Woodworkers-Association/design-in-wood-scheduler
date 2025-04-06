import { find } from 'lodash-es'

import { getContact } from '../clients/pro-class'
import type { User } from '#auth-utils'

export const login = async (email: string): Promise<User | undefined> => {
  const contact = await getContact(email)

  if (!contact) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const primaryAddress = find(contact.Addresses || [], ({ IsPrimary }) => IsPrimary)!
  const user: User = {
    email,
    id: contact.ContactId,
    isAdmin: false,
    address: {
      street1: primaryAddress.StreetAddress1,
      street2: primaryAddress.StreetAddress2,
      city: primaryAddress.City,
      state: primaryAddress.State.Abbreviation,
      postalCode: primaryAddress.PostalCode
    }
  }

  return user
}
