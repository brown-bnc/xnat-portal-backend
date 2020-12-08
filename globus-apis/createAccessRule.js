const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

const createAccessRule = async (access_token, endpoint_xid, principal, path, permissions, notify_email) => {
  const body ={
    "DATA_TYPE": "access",
    "principal_type": "identity",
    "principal": principal,
    "path": path,
    "permissions": permissions,
    "notify_email": notify_email
}
  const res = await fetch(new URL(`${process.env.TRANSFER_API_URL}/endpoint/${endpoint_xid}/access`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    })
  })
  if (!res.ok) {
    return await res.statusText
  }
  else return await res.text()
}
module.exports = createAccessRule
