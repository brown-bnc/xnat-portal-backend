const express = require('express')
const router = express.Router()
const getProjects = require('../xnat-apis/getProjects')
const startSession = require('../xnat-apis/startSession')
const deleteSession = require('../xnat-apis/deleteSession')
const userAliasToken = require('../xnat-apis/userAliasToken')
const jwt = require('express-jwt')
const fs = require('fs')
const bodyParser = require('body-parser')
const js2xmlparser = require("js2xmlparser")
const createProjects = require('../xnat-apis/createProjects')

const jsonparser = bodyParser.json()

const secret = fs.readFileSync('./public.pem');

/* GET projects listing. */
router.get('/',
jwt({ secret: secret, algorithms: ['RS256'] }),
async function (req, res) {
  // User info from keycloak
  const user = req.user.brownShortID

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
  await deleteSession(JSESSIONID)

  // Delete session for admin
  await deleteSession(ADMINJSESSIONID)

  // send the list of projects to response
  res.send(projects)
})

router.post('/',
jwt({ secret: secret, algorithms: ['RS256'] }),
jsonparser,
async function (req, res) {
  // User info from keycloak
  const user = req.user.brownShortID

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

  // Create projects
  const createResponse = await createProjects(JSESSIONID, js2xmlparser.parse('projectData',req.body))

  // Delete session for user
  await deleteSession(JSESSIONID)

  // Delete session for admin
  await deleteSession(ADMINJSESSIONID)

  res.send(createResponse)
})

module.exports = router
