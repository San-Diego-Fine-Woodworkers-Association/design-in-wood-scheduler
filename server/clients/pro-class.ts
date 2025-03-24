const {
  PROCLASS_API_BASE_URL,
  PROCLASS_API_USERNAME,
  PROCLASS_API_PASSWORD
} = process.env

export const getUser = async (memberID: number): Promise<object> => {
  return fetch(`${PROCLASS_API_BASE_URL}/Contacts/${memberID}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(PROCLASS_API_USERNAME + ':' + PROCLASS_API_PASSWORD).toString('base64')}`
    }
  }).then((res) => {
    if (res.status === 200) return res.json()

    const err = createError({ statusCode: res.status, statusMessage: res.statusText })
    console.error('Exception occurred while looking up user', err)
    throw err
  })
}
