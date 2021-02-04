const express = require("express");
const router = express.Router();
const startSession = require("../xnat-apis/startSession");
const deleteSession = require("../xnat-apis/deleteSession");
const userAliasToken = require("../xnat-apis/userAliasToken");
const jwt = require("express-jwt");
const fs = require("fs");
const bodyParser = require("body-parser");
const js2xmlparser = require("js2xmlparser");
const uploadStatus = require("../xnat-apis/uploadStatus");

const jsonparser = bodyParser.json();

const secret = fs.readFileSync("./public.pem");

router.get(
  "/",
  jwt({ secret: secret, algorithms: ["RS256"] }),
  jsonparser,
  async function (req, res, next) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // getting upload id(path) from body
    const upload_id = req.body.upload_id;

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

        let statusResponse;
        try {
          // Get upload status
          statusResponse = await uploadStatus(alias, secret, upload_id);
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
        if (statusResponse) {
          // send the status of the upload
          res.send(statusResponse);
        }
      }
    }
  }
);

module.exports = router;
