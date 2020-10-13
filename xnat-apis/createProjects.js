const fetch = require('node-fetch')
const { Headers } = require('node-fetch')

const createProjects = async (JSESSIONID, xmldata) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/projects`,
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'text/xml; charset=utf-8',
        cookie: `JSESSIONID=${JSESSIONID}`
      }),
      body: xmldata
    }
  )
  if (!res.ok) throw new Error(res.statusText)
  else return await res.statusText
}

module.exports = createProjects
