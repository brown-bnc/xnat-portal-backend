// function to get the transfer api scope token for globus
// checks for the token in other tokens or returns the common access token
  const check_for_transfer_api_token = (access_token) => {
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
// function to get the auth api scope token for globus
// checks for the token in other tokens or returns the common access token
  const check_for_auth_api_token = (access_token) => {
    if(access_token.scope.indexOf("urn:globus:auth:scope:auth.globus.org:view_identities")<0)
      return access_token.other_tokens.map((item)=> {
      if(item.scope==="urn:globus:auth:scope:auth.globus.org:view_identities")
      return item.access_token
    })
    else
      return access_token.access_token
  }

  module.exports = {check_for_transfer_api_token, check_for_auth_api_token};