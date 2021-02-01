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

/* POST mdir */
router.post(
  "/",
  // using json web token to decrypt user brown id sent from keycloak
  jwt({ secret: secret, algorithms: ["RS256"] }),
  async function (req, res, next) {
    // User info from keycloak
    const user = req.user.brownShortID;

    // getting path to give access to from request body
    const path = req.body.path;

    // getting permissions to set from body
    const permission = req.body.permission;

    // email
    const username = user + "@brown.edu";

    // client credentials grant login with the cliend
    // id and secret in the environment variables
    let access_token;
    await clientCredentialsGrant(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    )
      .then((response) => {
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
      // get identity from the username
      await getIdentity(authAPIAccessToken, username).then((res) => {
        identities = JSON.parse(res).identities;
      });

      const getPrincipal = () => {
        return identities.map((item) => {
          if (item.username === username) {
            return item.id;
          }
        })[0];
      };

      const getNotifyEmail = () => {
        return identities.map((item) => {
          if (item.username === username) {
            return item.email;
          }
        })[0];
      };
      if (identities) {
        const principal = getPrincipal();
        const notify_email = getNotifyEmail();

        let response;
        // create access rule transfer api
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
