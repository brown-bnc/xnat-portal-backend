const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const userAliasToken = async (JSESSIONID, user) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/services/tokens/issue/user/${user}`, {
    headers: new Headers({
      cookie: `JSESSIONID=${JSESSIONID}`
    })
  })
  if (!res.ok) throw new Error(res.statusText)
  else return await res.json()
}

module.exports = userAliasToken
