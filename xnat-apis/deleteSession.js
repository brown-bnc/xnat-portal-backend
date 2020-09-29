const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const deleteSession = async (JSESSIONID) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    method: 'DELETE',
    headers: new Headers({
      cookie: `JSESSIONID=${JSESSIONID}`
    })
  })
  if (!res.ok) throw new Error(res.statusText)
}

module.exports = deleteSession
