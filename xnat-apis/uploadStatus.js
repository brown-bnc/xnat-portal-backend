const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");

const uploadStatus = async (alias, secret, Upload_ID) => {
  var url = new URL(`${process.env.BASE_XNAT_URL}${Upload_ID}`);
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Basic ${base64.encode(`${alias}:${secret}`)}`,
    }),
  });
  if (res.statusText !== "OK") {
    throw { message: res.statusText };
  } else return await res.text();
};

module.exports = uploadStatus;
