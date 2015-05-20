import {hostname} from 'os';
let host = hostname();

export default function(env) {
  //return strongest to weakest preference
  switch (env) {
    case "development":
    case "dev":
      return [host,'development','dev','default'];
    case "test":
      return [host,'testing','test','default'];
    case "qa":
      return [host,'qa','default'];
    case "stage":
      return [host,'stage','default'];
    case "production":
    case "prod":
      return [host,'production','prod','default'];
    case "local":
    default:
      return [host,'local','development','dev','default'];
  }

  return envs;
}