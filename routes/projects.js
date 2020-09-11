var express = require('express');
var router = express.Router();
var request = require('request')

// Load up the environment variables.
require('dotenv').config()

/* GET projects listing. */
router.get('/:user', function(req, res, next) {

  // User info from keycloak
  const user = req.params.user;

  // Login with admin credentials
  var username = process.env.USERNAME,
  password = process.env.PASSWORD,
  url = "https://" + username + ":" + password + "@bnc.brown.edu/xnat-dev";

  // Get user accesss token for the specific username from keycloak using XNAT User Alias Token API
  request(
    {
        url : url + '/data/services/tokens/issue/user/' + user
    },
    function (error, response, body) {
      var token = JSON.parse(body)
      
      // Login with user credentials
      var username = token.alias,
      password = token.secret,
      url = "https://" + username + ":" + password + "@bnc.brown.edu/xnat-dev";

      // Get the projects for that specific user using XNAT Project API
      request(
        {
            url : url + '/data/projects'
        },
        function (error, response, body) {
          res.send(body)
        }
      );
    }
  );

  
});

module.exports = router;
