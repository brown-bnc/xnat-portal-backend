const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const getProjects = async (JSESSIONID) => {
  try{
    const res = await fetch(`${process.env.BASE_XNAT_URL}/data/projects/`,
      {
        headers: new Headers({
          cookie: `JSESSIONID=${JSESSIONID}`
        })
      }
    )
    return await res.json()
  }
  catch(err){
    return new Error(err)
  }
}

module.exports = getProjects
