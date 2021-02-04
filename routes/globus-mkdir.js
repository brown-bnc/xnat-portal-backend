const express = require("express");
const router = express.Router();
const clientCredentialsGrant = require("../globus-apis/clientCredentialsGrant");
const makeDirectory = require("../globus-apis/makeDirectory");
const utils = require("../utils");

/* POST make directory inside specified Globus path */
router.post("/", async function (req, res, next) {
  // getting path from request body
  const path = req.body.path;

  // client credentials grant login with the client id and secret in the environment variables
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
    // make directory globus transfer API call
    await makeDirectory(transferAPIAccessToken, process.env.ENDPOINT_ID, path)
      .then((res) => {
        response = res;
      })
      // error handling
      .catch((err) => {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      });

    if (response) {
      // send the response if the directory was successfully created
      res.send(response);
    }
  }
});

module.exports = router;
