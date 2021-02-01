const express = require("express");
const router = express.Router();
const clientCredentialsGrant = require("../globus-apis/clientCredentialsGrant");
const makeDirectory = require("../globus-apis/makeDirectory");
const utils = require("../utils");

/* POST mkdir */
router.post("/", async function (req, res, next) {
  // getting directory name.
  const path = req.body.path;

  // client credentials grant
  let access_token;
  await clientCredentialsGrant(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
    .then((response) => {
      access_token = JSON.parse(response);
    })
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
      .catch((err) => {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      });

    if (response) {
      // send the response
      res.send(response);
    }
  }
});

module.exports = router;
