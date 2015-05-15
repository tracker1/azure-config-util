import azure from 'azure-storage-simple';
import getEnvironments from './get-environments';
import parseRaw from './parse-raw';

export {queryAzure as default};

async function queryAzure(options) {
  let table = azure(options.account,options.accountKey).table(options.accountTable);
  let queries = getEnvironments(options.environmnent).map((env)=>querySet(table,options.namespace,env));
  return parseRaw(await Promise.all(queries));
}

async function querySet(table,namespace,env) {
  let result = [];
  let records = table.query().where('Namespace eq ? and Environment eq ?', namespace, env);
  while (records.next) {
    records = await records.next();
    result = result.concat(records);
  }
  return result;
}


