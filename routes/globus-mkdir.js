const express = require('express')
const router = express.Router()
const client_credentials_grant = require('../globus-apis/client_credentials_grant')
const make_directory = require('../globus-apis/make_directory')

/* POST mdir */
router.get('/',
async function (req, res, next) {
  // client credentials grant
  let access_token;
  await client_credentials_grant(process.env.CLIENT_ID, process.env.CLIENT_SECRET).then(
    (response) => {
      access_token = JSON.parse(response).access_token
    }
  )
  console.log(access_token+"\n"+"\n"+"\n")
  
  // make directory globus transfer API
  await make_directory(access_token, process.env.ENDPOINT_ID).then(
    (response) => {
      console.log(JSON.parse(response))
    }
  )

  // send the response
  res.send(response)
})

module.exports = router
