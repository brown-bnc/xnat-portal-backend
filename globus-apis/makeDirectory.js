const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");

/**
 * Make Directory Globus Transfer API
 * 
 * POST request
 * DATA_TYPE: Always has value "mkdir" to indicate this document type.
 * path: 	Absolute path on remote endpoint.
 * 
 * Create a directory at the specified path on an endpoint filesystem. The endpoint must be activated before performing this operation.
 * https://docs.globus.org/api/transfer/file_operations/#make_directory
 * 
 * @constructor
 * @param {string} access_token - Access token obtained from client credentials grant.
 * @param {string} endpoint_xid - The id of the endpoint
 * @param {string} path - Absolute path on remote endpoint.
 */

const makeDirectory = async (access_token, endpoint_xid, path) => {
  const body = {
    DATA_TYPE: "mkdir",
    path: path,
  };
  const res = await fetch(
    new URL(
      `${process.env.TRANSFER_API_URL}/operation/endpoint/${endpoint_xid}/mkdir`
    ),
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      }),
    }
  );
  if (res.statusText !== "Accepted") {
    throw { message: res.statusText };
  } else return await res.text();
};
module.exports = makeDirectory;
