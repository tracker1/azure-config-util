import optional from './optional';
import getConfig from './get-config';

let mssql = optional('mssql-ng');

export {getSql as default};

async function getSql(options,nameOrOptions) {
  //missing optional dependency
  if (!mssql) throw new Error(`Missing optional dependency 'mssql-ng'.`);

  //options object specified, use it directly
  if (nameOrOptions && typeof nameOrOptions === 'object') return mssql(nameOrOptions);

  //lookup as name or default
  if (typeof nameOrOptions !== 'string') nameOrOptions = null;
  let name = name || 'default';

  let cfg = getConfig(options);
  let sqlOptions = cfg && cfg.sql && cfg.sql[name];

  if (!sqlOptions) throw new Error(`Missing sql configuration for '${name}'`);
  
  return mssql(sqlOptions);
}