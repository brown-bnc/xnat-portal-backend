const express = require("express");
const router = express.Router();
const clientCredentialsGrant = require("../globus-apis/clientCredentialsGrant");
const listDirectories = require("../globus-apis/listDirectories");

/* POST ls */
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

  const check_for_transfer_api_token = () => {
    if (
      access_token.scope.indexOf(
        "urn:globus:auth:scope:transfer.api.globus.org:all"
      ) < 0
    )
      return access_token.other_tokens.map((item) => {
        if (item.scope === "urn:globus:auth:scope:transfer.api.globus.org:all")
          return item.access_token;
      });
    else return access_token.access_token;
  };

  if (access_token) {
    const transferAPIAccessToken = check_for_transfer_api_token();
    let response;
    // make directory globus transfer API
    await listDirectories(transferAPIAccessToken, process.env.ENDPOINT_ID, path)
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        let error = JSON.parse(JSON.stringify(err).split("\n")[0]);
        next(error);
      });

    if(response){
      // send the response
      res.send(response);
    }
  }
});

module.exports = router;
