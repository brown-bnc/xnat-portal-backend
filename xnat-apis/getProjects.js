const fetch = require("node-fetch");
const { Headers } = require("node-fetch");

const getProjects = async (JSESSIONID) => {
  const res = await fetch(`${process.env.BASE_XNAT_URL}/data/projects/`, {
    headers: new Headers({
      cookie: `JSESSIONID=${JSESSIONID}`,
    }),
  });
  if (res.statusText !== "OK") {
    throw { message: res.statusText };
  } else return await res.json();
};

module.exports = getProjects;
