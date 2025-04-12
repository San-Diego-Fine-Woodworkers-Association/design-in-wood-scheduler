import { chunk, first, join, last, map, toLower } from 'lodash-es'

import type { PCContact } from '~/types/pro-class'

const {
  PROCLASS_API_BASE_URL,
  PROCLASS_API_USERNAME,
  PROCLASS_API_PASSWORD
} = process.env

export const getContact = async (email: string): Promise<PCContact | undefined> => {
  return $fetch<PCContact[]>(`${PROCLASS_API_BASE_URL}/Contacts`, {
    query: {
      $top: 1,
      $filter: `Email eq '${email}'`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(PROCLASS_API_USERNAME + ':' + PROCLASS_API_PASSWORD).toString('base64')}`
    }
  }).then(data => first(data) as (PCContact | undefined)).catch((err) => {
    const error = createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while attempting to log user in',
      cause: err
    })

    console.error('Exception occurred while looking up user', err)

    throw error
  })
}

export const getContactsByIDs = async (ids: number[]): Promise<{ [key: number]: PCContact }> => {
  const idChunks = chunk(ids, 20)
  const contacts: { [key: number]: PCContact } = {}

  for (const chunk of idChunks) {
    const requests = await Promise.all(map(chunk, id =>
      $fetch<PCContact>(`${PROCLASS_API_BASE_URL}/Contacts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(PROCLASS_API_USERNAME + ':' + PROCLASS_API_PASSWORD).toString('base64')}`
        }
      }).catch((err) => {
        const error = createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'An error occurred while attempting to log user in',
          cause: err
        })

        console.error('Exception occurred while looking up user', err)

        throw error
      })
    ))

    for (const contact of requests) {
      contacts[contact.ContactId] = contact
    }
  }
  return contacts
}

export const searchForContacts = async (searchString: string, limit?: number): Promise<PCContact[]> => {
  const searchParts = searchString.split(' ')
  const firstNameFilter = (str: string) => `startswith(tolower(FirstName), '${toLower(str)}')`
  const lastNameFilter = (str: string) => `startswith(tolower(LastName), '${toLower(str)}')`
  const emailFilter = (str: string) => `startswith(tolower(Email), '${toLower(str)}')`

  let filter
  if (searchParts.length >= 2) {
    const firstPart = first(searchParts)!
    const lastPart = last(searchParts)!
    filter = join([firstNameFilter(firstPart), lastNameFilter(lastPart)], ' and ')
  }
  else {
    filter = join([firstNameFilter(searchString), lastNameFilter(searchString), emailFilter(searchString)], ' or ')
  }

  return $fetch<PCContact[]>(`${PROCLASS_API_BASE_URL}/Contacts`, {
    params: {
      $filter: filter,
      $top: limit || 15
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(PROCLASS_API_USERNAME + ':' + PROCLASS_API_PASSWORD).toString('base64')}`
    }
  }).catch((err) => {
    const error = createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while attempting to search for contacts',
      cause: err
    })

    console.error('Exception occurred while searching for contacts', err)

    throw error
  })
}
