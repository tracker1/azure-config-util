import stringify from 'json-stable-stringify';
import {sanitize} from '../options';
import queryAzure from './query-azure';

let cache = {}; //config cache
let loaders = {}; //loader cache

export default function(options) {
  options = sanitize(options);
  var key = stringify(key);
  if (cache[key]) return Promise.resolve(cache[key]);
  if (loaders[key]) return loaders[key];
  return (loaders[key] = loadRawConfig(options,key));
}

async function loadRawConfig(options,key) {
  //get the raw values from azure
  var config = await queryAzure(options);

  cache[key] = config; //cache the current value
  setTimeout(()=>{delete cache[key];},300000).unref(); //remove cached entry after 5 minutes

  delete loaders[key]; //remove reference to the loader

  return config; //resolve the configuration
}