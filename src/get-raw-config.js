require('cc-globals');
var log = require('./log');
var azure = require('azure-storage');
var repromise = require('repromise');
var tblsvc = {}

module.exports = getRaw;

function getRaw(options) {
  log('getRaw', options);
  return getTableService(options)
    .then((svc)=>new Promise((resolve, reject)=>{
      var query = new azure.TableQuery().where('Namespace eq ?', options.namespace); //.select(['Namespace','Environment','Section','Key','JsonValue']);
      return svc.queryEntities(options.accountTable, query, null, (err,result,response)=>{
        if (err) return reject(err);
        return resolve(result && result.entries || []);
      });
    }))
    .then(R.map(mapResponseValue));
}

function getTableService(options) {
  var key = `${options.account}/${options.accountKey}/${options.accountTable}/${options.namespace}`;
  
  if (!tblsvc[key]) {
    tblsvc[key] = repromise(()=>Promise.resolve(azure.createTableService(options.account, options.accountKey)))
      .then((svc)=>ensureTable(svc,options.accountTable))
      .catch((err)=>{
        delete tblsvc[key];
        return Promise.reject(err);
      });
  }
  return tblsvc[key];
}


function ensureTable(svc,table) {
  return repromise(()=>new Promise((resolve,reject)=>{
    svc.createTableIfNotExists(table, (err,result,response)=>{
      if (err) return reject(err);
      return resolve(svc);
    });
  }));
}

function mapResponseValue(item) {
  var ns = item.Namespace._ || 'default';
  var env = item.Environment._ || 'default';
  var section = item.Section._ || '_';
  var key = item.Key._ || '_';
  var rawval = item.JsonValue._;
  var val;

  try {
    val = JSON.parse(rawval);
  } catch(err) {
    //bad form, but don't blow up
    //use value as-is as a string
    val = rawval;

    //handle common boolean expressions
    switch (val.toLowerCase().trim()) {
      case 'y':
      case 'yes':
      case 'true':
      case 't':
        val = true;
        break;
      case 'n':
      case 'no':
      case 'false':
      case 'f':
        val = false;
        break;
    }
  }
  return {ns,env,section,key,val};
}