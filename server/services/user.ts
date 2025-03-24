import { find, get } from 'lodash-es'

import { getUser } from '../clients/pro-class'
import type { User } from '#auth-utils'

// export const storeUser = async (email: string, memberID: number) => {
//   const existingUser = await db.select('id').from('members').where('id', memberID)

//   if (!isEmpty(existingUser)) return

//   return db.insert({ id: memberID, email }).into('members')
// }

export const login = async (email: string, memberID: number): Promise<User | undefined> => {
  const data = await getUser(memberID).catch((err) => {
    if (err.statusCode === 404) return undefined
    throw err
  })

  if (!data || get(data, 'Email') !== email) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const primaryAddress = find(get(data, 'Addresses', []), ({ IsPrimary }) => IsPrimary)
  const user: User = {
    email,
    memberID,
    isAdmin: false,
    address: {
      street1: get(primaryAddress, 'StreetAddress1'),
      street2: get(primaryAddress, 'StreetAddress2'),
      city: get(primaryAddress, 'City'),
      state: get(primaryAddress, 'State.Abbreviation'),
      postalCode: get(primaryAddress, 'PostalCode')
    }
  }

  // try {
  //   await storeUser(user.email, user.memberID)
  // }
  // catch (err) {
  //   console.error('Error occurred while storing user in DB', err)
  //   throw createError({ statusCode: 500, statusMessage: 'Internal Server Error occurred while logging in' })
  // }

  return user
}
