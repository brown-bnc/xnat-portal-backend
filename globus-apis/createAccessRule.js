const fetch = require('node-fetch')
const base64 = require('base-64')
const { Headers } = require('node-fetch')

/**
 * Create access rule Globus Transfer API
 * 
 * POST request
 * DATA_TYPE: "access"
 * principal_type: "identity"
 * principal: a Globus identity uuid
 * path: Absolute path to a directory the access rule applies to.
 * permissions: How much permission to grant the principal specified in principal_type and principal. Either read-only, specified as "r", or read-write, specified as "rw".
 * notify_email: When creating an identity rule, clients can optionally specify a valid email address to send notification to. 
 * 
 * Create a new access rule. The response contains the id of the newly created rule in the access_id field.
 * https://docs.globus.org/api/transfer/acl/#rest_access_create
 * 
 * @constructor
 * @param {string} access_token - Access token obtained from client credentials grant.
 * @param {string} endpoint_xid - The id of the endpoint
 * @param {string} principal - a Globus identity uuid (identiy of the user)
 * @param {string} path - Absolute path to a directory the access rule applies to.
 * @param {string} permissions - How much permission to grant the principal specified in principal_type and principal. Either read-only, specified as "r", or read-write, specified as "rw".
 * @param {string} notify_email - When creating an identity rule, clients can optionally specify a valid email address to send notification to.
 */

const createAccessRule = async (access_token, endpoint_xid, principal, path, permissions, notify_email) => {
  const body ={
    DATA_TYPE: "access",
    principal_type: "identity",
    principal: principal,
    path: path,
    permissions: permissions,
    notify_email: notify_email
}
  const res = await fetch(new URL(`${process.env.TRANSFER_API_URL}/endpoint/${endpoint_xid}/access`), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    })
  })
  if (res.statusText !== "Created" && res.statusText !== "Conflict") {
    throw { message: res.statusText };
  } else return await res.text();
}
module.exports = createAccessRule
