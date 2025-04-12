import { filter, find, join, keyBy, map, mapValues } from 'lodash-es'

import { getContact, getContactsByIDs, searchForContacts } from '../clients/pro-class'
import db from '../clients/db'

import type { User } from '#auth-utils'
import type { PCContact } from '~/types/pro-class'

type userAttributes = {
  isAdmin: boolean
}

const getPrimaryAddress = (contact: PCContact): User['address'] | undefined => {
  const address = find(contact.Addresses || [], ({ IsPrimary }) => IsPrimary)
  if (!address) return

  return {
    street1: address.StreetAddress1,
    street2: address.StreetAddress2,
    city: address.City,
    state: address.State.Abbreviation,
    postalCode: address.PostalCode
  }
}
const mapContact = (contact: PCContact, userAttributes?: userAttributes): User => {
  const primaryAddress = getPrimaryAddress(contact)
  const user: User = {
    name: join((filter([contact?.FirstName, contact?.LastName])), ' '),
    email: contact.Email,
    id: contact.ContactId,
    isAdmin: userAttributes?.isAdmin,
    address: primaryAddress
  }

  return user
}

export const login = async (email: string): Promise<User | undefined> => {
  const contact = await getContact(email)

  if (!contact) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const userAttributes = await db.select({ userID: 'user_id', isAdmin: 'is_admin' }).from('user_attributes').where('user_id', contact.ContactId).first()

  return mapContact(contact, userAttributes)
}

export const getById = async (id: number): Promise<User> => {
  const users = await getByIDs([id])

  return users[id]
}

export const getByIDs = async (ids: number[]): Promise<{ [key: number]: User }> => {
  const [contacts, userAttributes] = await Promise.all([
    getContactsByIDs(ids),
    db.select({ userID: 'user_id', isAdmin: 'is_admin' }).from('user_attributes').whereIn('user_id', ids)
      .then(attributes => keyBy(attributes, 'userID'))
  ])

  return mapValues(contacts, c => mapContact(c, userAttributes[c.ContactId]))
}

export const search = async (nameString: string, limit?: number): Promise<User[]> => {
  const contacts = await searchForContacts(nameString, limit)

  return map(contacts, c => mapContact(c))
}
