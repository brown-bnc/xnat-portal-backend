const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

const startSession = async (username, password) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    headers: new Headers({
      Authorization: `Basic ${base64.encode(`${username}:${password}`)}`
    })
  })
  if (!res.ok) throw new Error(res.statusText)
  else return await res.text()
}

module.exports = startSession
