const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");

/**
 * Client Credentials Grant Globus Auth API
 * 
 * POST request
 * scope: Plus-separated or space-separated list of scopes your client is requesting.
 * grant_type: "client_credentials"
 * 
 * Taking actions as a client identity. Returns an access_token(or multiple access tokens) valid for that identity.
 * This request’s Authorization header must contain resource server’s client identifier (client_id) and client secret (client_secret) in a base64-encoded "Basic Authorization" scheme.
 * https://docs.globus.org/api/auth/reference/#client_credentials_grant
 * 
 * @constructor
 * @param {string} client_id - The client ID obtained when registering your client.
 * @param {string} client_secret - The client secret generated for the client ID.
 */

const clientCredentialsGrant = async (client_id, client_secret) => {
  const res = await fetch(
    new URL(`${process.env.BASE_GLOBUS_URL}/v2/oauth2/token`),
    {
      method: "POST",
      body:
        "grant_type=client_credentials&scope=urn:globus:auth:scope:transfer.api.globus.org:all+urn:globus:auth:scope:auth.globus.org:view_identities+openid+email+profile",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64.encode(
          `${client_id}:${client_secret}`
        )}`,
      }),
    }
  );
  if (res.statusText !== "OK") {
    throw { message: res.statusText };
  } else return await res.text();
};
module.exports = clientCredentialsGrant;
