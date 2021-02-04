const express = require("express");
const router = express.Router();
const startSession = require("../xnat-apis/startSession");
const deleteSession = require("../xnat-apis/deleteSession");
const userAliasToken = require("../xnat-apis/userAliasToken");
const jwt = require("express-jwt");
const fs = require("fs");
const bodyParser = require("body-parser");
const importAPI = require("../xnat-apis/importAPI");

const jsonparser = bodyParser.json();

const secret = fs.readFileSync("./public.pem");

router.post(
  "/",
  jwt({ secret: secret, algorithms: ["RS256"] }),
  jsonparser,
  async function (req, res, next) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // getting project name from body
    const project = req.body.project;

    // getting subject id name from body
    const subject_id = req.body.subject_id;

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
        // save tokenResponse containing alias and secret for user
        tokenResponse = await userAliasToken(ADMINJSESSIONID, user);
      } catch (err) {
        // error handling for user alias token api
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      }
      if (tokenResponse) {
        // get alias and secret from tokenResponse
        const alias = tokenResponse.alias;
        const secret = tokenResponse.secret;

        let createResponse;
        try {
          // Get the user projects
          // Create projects
          createResponse = await importAPI(alias, secret, project, subject_id);
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
        if (createResponse) {
          // send the list of projects to response
          res.send(createResponse);
        }
      }
    }
  }
);

module.exports = router;
