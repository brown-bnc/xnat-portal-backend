const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const deleteSession = async (JSESSIONID) => {
  try{
    const res = await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
      method: 'DELETE',
      headers: new Headers({
        cookie: `JSESSIONID=${JSESSIONID}`
      })
    })
  }
  catch(err){
    return new Error(err)
  }
}

module.exports = deleteSession
