var express = require('express')
var router = express.Router()
var fetch = require('node-fetch')
var { Headers } = require('node-fetch')
var base64 = require('base-64')

/* GET projects listing. */
router.get('/:user', async function (req, res, next) {
  // User info from keycloak
  const user = req.params.user

  // Login with admin credentials
  const adminUsername = process.env.USERNAME
  const adminPassword = process.env.PASSWORD

  // Start session for admin
  const ADMINJSESSIONID = await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    headers: new Headers({
      Authorization: `Basic ${base64.encode(`${adminUsername}:${adminPassword}`)}`
    })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
    return res.text()
  })

  // Get the alias and secret for user
  const tokenResponse = await fetch(`${process.env.BASE_XNAT_URL}/data/services/tokens/issue/user/${user}`, {
    headers: new Headers({
      cookie: `JSESSIONID=${ADMINJSESSIONID}`
    })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })

  const alias = tokenResponse.alias
  const secret = tokenResponse.secret

  // Start the session for user
  const JSESSIONID = await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    headers: new Headers({
      Authorization: `Basic ${base64.encode(`${alias}:${secret}`)}`
    })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
    return res.text()
  })

  // Get the user projects
  const projects = await fetch(`${process.env.BASE_XNAT_URL}/data/projects/`
    , {
      headers: new Headers({
        cookie: `JSESSIONID=${JSESSIONID}`
      })
    }
  ).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  })

  // Delete session for user
  await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    method: 'DELETE',
    headers: new Headers({
      cookie: `JSESSIONID=${JSESSIONID}`
    })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
  })

  // Delete session for admin
  await fetch(`${process.env.BASE_XNAT_URL}/data/JSESSION/`, {
    method: 'DELETE',
    headers: new Headers({
      cookie: `JSESSIONID=${ADMINJSESSIONID}`
    })
  }).then(function (res) {
    if (!res.ok) throw new Error(res.statusText)
  })

  // send the list of projects to response 
  res.send(projects)
})

module.exports = router
