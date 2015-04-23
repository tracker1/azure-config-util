var stringify = require('json-stable-stringify');
var getRawCached = require('./get-raw-cached');
var parseRawConfig = require('./parse-raw-config');
var cache = {};
var loaders = {};

module.exports = loadConfig;

function loadConfig(options) {
  try {
    var key = stringify(options);
    if (cache[key]) return Promise.resolve(cache[key]);
    if (!loaders[key]) loaders[key] = createLoader(key,options);
    return loaders[key];
  } catch(err) {
    return Promise.reject(err);
  }
}

function createLoader(key,options) {
  var first = true;
  return runLoader();

  function setReload(){
    //reload in 5 minutes - unref == don't block exit
    setTimeout(runLoader, 300000 /*5 min*/).unref();
  }

  function runLoader() {
    return getRawCached(options)
      .then(
        (items)=>Promise.resolve(parseRawConfig(options,items)).then((config)=>{
          config._raw = items; //stash raw items on config
          return config;
        })
      )
      .then(function(config){
        first = false; //no longer in the first try
        setReload();

        //cache result
        cache[key] = config;

        //return config
        return config;
      })
      .catch(function(err){
        //if this didn't fail on the first try
        if (!first) setReload();

        //remove loader
        delete loaders[key];

        //raise error
        return Promise.reject(err);
      })
  }
}