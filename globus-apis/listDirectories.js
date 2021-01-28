const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");
const { compile } = require("morgan");

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
