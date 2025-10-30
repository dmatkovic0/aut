const environments = {
    prod: "https://corehr.hrcloud.com/Start/#/Authentication/Login",
    stg: "https://corehr.staging.hrcloud.net/Start/#/Authentication/Login",
    qa: "https://corehr.qa.hrcloud.net/Start/#/Authentication/Login"
  };
  
  function getEnvironmentUrl(env) {
    const url = environments[env.toLowerCase()];
    if (!url) {
      throw new Error(`Unknown environment: ${env}. Valid options are: prod, stg, qa`);
    }
    return url;
  }
  
  module.exports = {
    getEnvironmentUrl,
  };