const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const userAliasToken = async (JSESSIONID, user) => {
  try{
    const res = await fetch(`${process.env.BASE_XNAT_URL}/data/services/tokens/issue/user/${user}`, {
      headers: new Headers({
        cookie: `JSESSIONID=${JSESSIONID}`
      })
    })
    return await res.json()
  }
  catch(err){
    return new Error(err)
  }
  
}

module.exports = userAliasToken
