const express = require("express");
const router = express.Router();
const getProjects = require("../xnat-apis/getProjects");
const startSession = require("../xnat-apis/startSession");
const deleteSession = require("../xnat-apis/deleteSession");
const userAliasToken = require("../xnat-apis/userAliasToken");
const jwt = require("express-jwt");
const fs = require("fs");
const bodyParser = require("body-parser");
const js2xmlparser = require("js2xmlparser");
const createProjects = require("../xnat-apis/createProjects");

const jsonparser = bodyParser.json();

const secret = fs.readFileSync("./public.pem");

/* GET projects listing. */
router.get(
  "/",
  jwt({ secret: secret, algorithms: ["RS256"] }),
  async function (req, res, next) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // Login with admin credentials
    const adminUsername = process.env.USERNAME;
    const adminPassword = process.env.PASSWORD;

    let ADMINJSESSIONID;
    try {
      // Start session for admin
      ADMINJSESSIONID = await startSession(adminUsername, adminPassword);
    } catch (err) {
      let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
      next(error);
    }
    if (ADMINJSESSIONID) {
      // Get the alias and secret for user
      let tokenResponse;
      try {
        tokenResponse = await userAliasToken(ADMINJSESSIONID, user);
      } catch (err) {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      }
      if (tokenResponse) {
        const alias = tokenResponse.alias;
        const secret = tokenResponse.secret;
        let JSESSIONID;
        try {
          // Start the session for user
          JSESSIONID = await startSession(alias, secret);
        } catch (err) {
          let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
          next(error);
        }

        if (JSESSIONID) {
          let projects;
          try {
            // Get the user projects
            projects = await getProjects(JSESSIONID);
          } catch (err) {
            let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
            next(error);
          }

          try {
            // Delete session for user
            await deleteSession(JSESSIONID);
          } catch (err) {
            let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
            next(error);
          }

          try {
            // Delete session for admin
            await deleteSession(ADMINJSESSIONID);
          } catch (err) {
            let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
            next(error);
          }
          if (projects) {
            // send the list of projects to response
            res.send(projects);
          }
        }
      }
    }
  }
);

router.post(
  "/",
  jwt({ secret: secret, algorithms: ["RS256"] }),
  jsonparser,
  async function (req, res) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // Login with admin credentials
    const adminUsername = process.env.USERNAME;
    const adminPassword = process.env.PASSWORD;

    // Start session for admin
    const ADMINJSESSIONID = await startSession(adminUsername, adminPassword);

    // Get the alias and secret for user
    const tokenResponse = await userAliasToken(ADMINJSESSIONID, user);

    const alias = tokenResponse.alias;
    const secret = tokenResponse.secret;

    // Start the session for user
    const JSESSIONID = await startSession(alias, secret);

    // Create projects
    const createResponse = await createProjects(
      JSESSIONID,
      js2xmlparser.parse("projectData", req.body)
    );

    // Delete session for user
    await deleteSession(JSESSIONID);

    // Delete session for admin
    await deleteSession(ADMINJSESSIONID);

    res.send(createResponse);
  }
);

module.exports = router;
