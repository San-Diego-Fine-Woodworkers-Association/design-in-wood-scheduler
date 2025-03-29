import { first } from 'lodash-es'

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
