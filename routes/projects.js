var express = require('express')
var router = express.Router()
var getProjects = require('../xnat-apis/getProjects')
const startSession = require('../xnat-apis/startSession')
const deleteSession = require('../xnat-apis/deleteSession')
const userAliasToken = require('../xnat-apis/userAliasToken')

/* GET projects listing. */
router.get('/:user', async function (req, res, next) {
  // User info from keycloak
  const user = req.params.user

  // Login with admin credentials
  const adminUsername = process.env.USERNAME
  const adminPassword = process.env.PASSWORD

  // Start session for admin
  const ADMINJSESSIONID = await startSession(adminUsername, adminPassword)

  // Get the alias and secret for user
  const tokenResponse = await userAliasToken(ADMINJSESSIONID, user)

  const alias = tokenResponse.alias
  const secret = tokenResponse.secret

  // Start the session for user
  const JSESSIONID = await startSession(alias, secret)

  // Get the user projects
  const projects = await getProjects(JSESSIONID)

  // Delete session for user
  deleteSession(JSESSIONID)

  // Delete session for admin
  deleteSession(ADMINJSESSIONID)

  // send the list of projects to response
  res.send(projects)
})

module.exports = router
