const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const fs = require('fs')
const clientCredentialsGrant = require('../globus-apis/clientCredentialsGrant')
const getIdentity = require('../globus-apis/getIdentity')
const createAccessRule = require('../globus-apis/createAccessRule')

const secret = fs.readFileSync('./public.pem');

/* POST mdir */
router.post('/',
jwt({ secret: secret, algorithms: ['RS256'] }),
async function (req, res, next) {
  // User info from keycloak
  const user = req.user.brownShortID

  // getting directory name.
  const path = req.body.path

  // getting directory name.
  const permission = req.body.permission

  // email
  const username = user+'@brown.edu'

  // client credentials grant
  let access_token
  await clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET).then(
    (response) => {
      access_token = JSON.parse(response)
    }
  )
  
  const check_for_transfer_api_token = () => {
    if(access_token.scope.indexOf("urn:globus:auth:scope:transfer.api.globus.org:all")<0)
      return access_token.other_tokens.map((item)=> {
      if(item.scope==="urn:globus:auth:scope:transfer.api.globus.org:all")
      return item.access_token
    })[0]
    else
      return access_token.access_token
  }

  const transferAPIAccessToken = check_for_transfer_api_token()

  const check_for_auth_api_token = () => {
    if(access_token.scope.indexOf("urn:globus:auth:scope:auth.globus.org:view_identities")<0)
      return access_token.other_tokens.map((item)=> {
      if(item.scope==="urn:globus:auth:scope:auth.globus.org:view_identities")
      return item.access_token
    })
    else
      return access_token.access_token
  }

  const authAPIAccessToken = check_for_auth_api_token()

  let identities;
  // make directory globus transfer API
  await getIdentity(authAPIAccessToken, username).then(
    (res) => {
      identities = JSON.parse(res).identities
    }
  )

  const getPrincipal = () => {
    return identities.map((item) => {
      if(item.username === username){
        return item.id
      }
    })[0]
  }
  
  const getNotifyEmail = () => {
    return identities.map((item) => {
      if(item.username === username){
        return item.email
      }
    })[0]
  }

  const principal = getPrincipal()
  const notify_email = getNotifyEmail()

  let response
  // create access rule transfer api 
  await createAccessRule(transferAPIAccessToken, process.env.ENDPOINT_ID, principal, path, permission, notify_email).then(
    (res) => {
      response = res
    }
  )


  // send the response
  res.send(response)
})

module.exports = router
