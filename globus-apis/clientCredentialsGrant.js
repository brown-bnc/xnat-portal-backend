const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

const clientCredentialsGrant = async (client_id, client_secret) => {
  const res = await fetch(new URL(`${process.env.BASE_GLOBUS_URL}/v2/oauth2/token`), {
    method: 'POST',
    body: 'grant_type=client_credentials&scope=urn:globus:auth:scope:transfer.api.globus.org:all+urn:globus:auth:scope:auth.globus.org:view_identities+openid+email+profile',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64.encode(`${client_id}:${client_secret}`)}`
    })
  })
  if (!res.ok) throw new Error(res.statusText)
  else return await res.text()
}
module.exports = clientCredentialsGrant
