var hostname = require('os').hostname();

module.exports = getEnvironets;

function getEnvironets(env) {
  //return strongest to weakest preference
  switch (env) {
    case "development":
    case "dev":
      return [hostname,'development','dev','default'];
    case "test":
      return [hostname,'testing','test','default'];
    case "qa":
      return [hostname,'qa','default'];
    case "stage":
      return [hostname,'stage','default'];
    case "production":
    case "prod":
      return [hostname,'production','prod','default'];
    case "local":
    default:
      return [hostname,'local','development','dev','default'];
  }

  return envs;
}