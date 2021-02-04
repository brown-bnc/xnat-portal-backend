const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const fs = require("fs");
const clientCredentialsGrant = require("../globus-apis/clientCredentialsGrant");
const getIdentity = require("../globus-apis/getIdentity");
const createAccessRule = require("../globus-apis/createAccessRule");
const utils = require("../utils");
// read secret from keycloak
const secret = fs.readFileSync("./public.pem");

/* POST create Globus access rule */
router.post(
  "/",
  // using json web token to decrypt user brown id sent from keycloak
  jwt({ secret: secret, algorithms: ["RS256"] }),
  async function (req, res, next) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // getting path to give access to from request body
    const path = req.body.path;

    // getting permissions to set for the path from request body
    const permission = req.body.permission;

    // email address of the user
    const username = user + "@brown.edu";

    // mapping and returning id from the identity resource type document
    const getPrincipal = () => {
      return identities.map((item) => {
        if (item.username === username) {
          return item.id;
        }
      })[0];
    };

    // mapping and returning notify email from the identity resource type document
    const getNotifyEmail = () => {
      return identities.map((item) => {
        if (item.username === username) {
          return item.email;
        }
      })[0];
    };

    // client credentials grant login with the client id and secret in the environment variables
    let access_token;
    await clientCredentialsGrant(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    )
      .then((response) => {
        // access token returned from the client credentials oauth grant of Globus
        access_token = JSON.parse(response);
      })
      // error handling
      .catch((err) => {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      });

    if (access_token) {
      // extract the token with transfer api scope (this is defined in utils.js)
      const transferAPIAccessToken = utils.check_for_transfer_api_token(
        access_token
      );

      // extract the token with auth api scope (this is defined in utils.js)
      const authAPIAccessToken = utils.check_for_auth_api_token(access_token);

      let identities;
      // get identity resource type document from the user email
      await getIdentity(authAPIAccessToken, username).then((res) => {
        identities = JSON.parse(res).identities;
      });

      if (identities) {

        // get the principal and notify email from the identity document to be used in the create access rule api call
        const principal = getPrincipal();
        const notify_email = getNotifyEmail();

        let response;
        // create access rule transfer api call
        await createAccessRule(
          transferAPIAccessToken,
          process.env.ENDPOINT_ID,
          principal,
          path,
          permission,
          notify_email
        )
          .then((res) => {
            response = res;
          })
          // error handling
          .catch((err) => {
            let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
            next(error);
          });

        if (response) {
          // send the response
          res.send(response);
        }
      }
    }
  }
);

module.exports = router;
