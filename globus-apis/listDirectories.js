const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");
const { compile } = require("morgan");

/**
 * List Directory Contents Globus Transfer API
 * 
 * GET request
 * 
 * List the contents of the directory at the specified path on an endpoint’s filesystem. The endpoint must be activated before performing this operation.
 * https://docs.globus.org/api/transfer/file_operations/#list_directory_contents
 * 
 * @constructor
 * @param {string} access_token - Access token obtained from client credentials grant.
 * @param {string} endpoint_xid - The id of the endpoint
 * @param {string} path - Path to a directory on the remote endpoint to list.
 */

const listDirectories = async (access_token, endpoint_xid, path) => {
  const res = await fetch(
    new URL(
      `${process.env.TRANSFER_API_URL}/operation/endpoint/${endpoint_xid}/ls?path=${path}`
    ),
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      }),
    }
  );
  if (res.statusText!="OK") {
    throw { message: res.statusText };
  } else return await res.text();
};
module.exports = listDirectories;
