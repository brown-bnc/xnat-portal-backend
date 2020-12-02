const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

const make_directory = async (access_token, endpoint_xid) => {
  const body ={
    "DATA_TYPE": "mkdir",
    "path": "/~/newdir"
  }
  const res = await fetch(new URL(`${process.env.TRANSFER_API_URL}/operation/endpoint/${endpoint_xid}/mkdir`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    })
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  else return await res.text()
}
module.exports = make_directory
