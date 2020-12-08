const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

const getIdentity = async (access_token, user_email) => {
  const res = await fetch(new URL(`${process.env.BASE_GLOBUS_URL}/v2/api/identities?usernames=${user_email}&include=identity_provider`), {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    })
  })
  if (!res.ok) throw new Error(res.statusText)
  else return await res.text()
}
module.exports = getIdentity
