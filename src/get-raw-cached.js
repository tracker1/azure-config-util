var stringify = require('json-stable-stringify');
var getRaw = require('./get-raw-config');
var loaders = {};
var rawcache = {};

module.exports = getRawCached;

function getRawCached(options) {
  var rawkey = `${options.account}/${options.accountKey}/${options.accountTable}/${options.namespace}`;
  if (rawcache[rawkey]) return Promise.resolve(rawcache[rawkey]);
  if (loaders[rawkey]) return loaders[rawkey];

  return getRaw(options)
    .then((rawdata)=>{
      rawcache[rawkey] = rawdata;
      delete loaders[rawkey];
      
      //remove cached raw data after 4 minutes
      //don't prevent app exit via this timer
      setTimeout(function(){
        delete rawcache[key];
      }, 240000).unref();
      
      return rawdata;
    })
    .catch((err)=>{
      delete loaders[rawkey];
      return Promise.reject(err); //raise error
    });
}
