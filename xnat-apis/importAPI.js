const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");
const { URLSearchParams } = require("url");

const uploadAPI = async (alias, secret, PROJECT_ID, SUBJECT_ID) => {
  var url = new URL(`${process.env.BASE_XNAT_URL}/data/services/import`);

  var params = {
    "import-handler": "inbox",
    cleanupAfterImport: false,
    PROJECT_ID: PROJECT_ID,
    SUBJECT_ID: SUBJECT_ID,
    EXPT_LABEL: SUBJECT_ID,
    path: `/data/xnat/inbox/${PROJECT_ID}/${SUBJECT_ID}`,
  };
  url.search = new URLSearchParams(params).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      Authorization: `Basic ${base64.encode(`${alias}:${secret}`)}`,
    }),
  });
  if (res.statusText !== "OK") {
    throw { message: res.statusText };
  } else return await res.text();
};

module.exports = uploadAPI;
