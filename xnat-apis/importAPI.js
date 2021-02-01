// curl -u rdhar2 -X POST
// "https://bnc.brown.edu/xnat-dev/data/services/
// import?import-handler=inbox&cleanupAfterImport=false&PROJECT_ID=SANES_SADLUM&SUBJECT_ID=107&EXPT_LABEL=107
// &path=/data/xnat/inbox/SANES_SADLUM/107” -k
const fetch = require("node-fetch");
const base64 = require("base-64");
const { Headers } = require("node-fetch");

const importAPI = async (JSESSIONID, PROJECT_ID, SUBJECT_ID) => {
  let res;
  res = await fetch(
    `${process.env.BASE_XNAT_URL}/data/services/import?import-handler=inbox&cleanupAfterImport=false&PROJECT_ID=${PROJECT_ID}&SUBJECT_ID=${SUBJECT_ID}&EXPT_LABEL=${SUBJECT_ID}&path=/data/xnat/inbox/${PROJECT_ID}/${SUBJECT_ID}`,
    {
      method: "POST",
      headers: new Headers({
        cookie: `JSESSIONID=${JSESSIONID}`
      }),
    }
  );
  if (res.statusText !== "OK") {
    throw { message: res.statusText };
  } else return await res.text();
};

module.exports = importAPI;
