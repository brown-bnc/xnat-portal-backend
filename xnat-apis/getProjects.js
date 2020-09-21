var fetch = require('node-fetch')
var { Headers } = require('node-fetch')

const getProjects = async (JSESSIONID) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/projects/`
    , {
      headers: new Headers({
        cookie: `JSESSIONID=${JSESSIONID}`
      })
    }
  )
  if (!res.ok) throw new Error(res.statusText)
  else return await res.json()
}

module.exports = getProjects
