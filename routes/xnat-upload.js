const express = require("express");
const router = express.Router();
const startSession = require("../xnat-apis/startSession");
const deleteSession = require("../xnat-apis/deleteSession");
const userAliasToken = require("../xnat-apis/userAliasToken");
const jwt = require("express-jwt");
const fs = require("fs");
const bodyParser = require("body-parser");
const uploadAPI = require("../xnat-apis/uploadAPI");

const jsonparser = bodyParser.json();

// read secret from keycloak
const secret = fs.readFileSync("./public.pem");

/* POST XNAT Upload */
router.post(
  "/",
  // using json web token to decrypt user brown id sent from keycloak
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
      // error handling
      let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
      next(error);
    }
    if (ADMINJSESSIONID) {
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

        let uploadResponse;
        try {
          // start the upload to XNAT using the user alias and secret
          uploadResponse = await uploadAPI(alias, secret, project, subject_id);
        } catch (err) {
          // error handling
          let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
          next(error);
        }

        try {
          // Delete session for admin
          await deleteSession(ADMINJSESSIONID);
        } catch (err) {
          // error handling
          let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
          next(error);
        }
        if (uploadResponse) {
          // send the list of projects to response
          res.send(uploadResponse);
        }
      }
    }
  }
);

module.exports = router;
