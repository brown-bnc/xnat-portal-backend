const express = require("express");
const router = express.Router();
const startSession = require("../xnat-apis/startSession");
const deleteSession = require("../xnat-apis/deleteSession");
const userAliasToken = require("../xnat-apis/userAliasToken");
const jwt = require("express-jwt");
const fs = require("fs");
const bodyParser = require("body-parser");
const js2xmlparser = require("js2xmlparser");
const importAPI = require("../xnat-apis/importAPI");

const jsonparser = bodyParser.json();

const secret = fs.readFileSync("./public.pem");

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
    const createResponse = await importAPI(
      JSESSIONID,
      "SANES_SADLUM",
      123
    );

    // Delete session for user
    await deleteSession(JSESSIONID);

    // Delete session for admin
    await deleteSession(ADMINJSESSIONID);

    res.send(createResponse);
  }
);

module.exports = router;
