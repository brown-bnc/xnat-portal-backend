const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

/**
 * Get Identity Globus Auth API
 * 
 * GET request
 * 
 * Returns an identity resource type document for the specified username
 * https://docs.globus.org/api/auth/reference/#get_identities
 * 
 * @constructor
 * @param {string} access_token - Access token obtained from client credentials grant.
 * @param {string} user_email - The email address of user
 */

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
