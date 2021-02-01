const express = require("express");
const router = express.Router();
const clientCredentialsGrant = require("../globus-apis/clientCredentialsGrant");
const listDirectories = require("../globus-apis/listDirectories");
const utils = require("../utils");

/* POST ls */
router.post("/", async function (req, res, next) {
  // getting path from request body
  const path = req.body.path;

  // client credentials grant login with the cliend
  // id and secret in the environment variables
  let access_token;
  await clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
    .then((response) => {
      // get the access token for using in the other globus APIs below
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
    let response;
    // list directories globus transfer API call
    await listDirectories(transferAPIAccessToken, process.env.ENDPOINT_ID, path)
      .then((res) => {
        response = res;
      })
      // error handling
      .catch((err) => {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      });

    if (response) {
      // send the response which contains all the directories in the path
      res.send(response);
    }
  }
});

module.exports = router;
