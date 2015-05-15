
let d = {}; //defaults

export function set(options){
  d = options || {};
}


export function get() {
  var e = process.env;
  var c;
  var ret;

  try {
    e = process.env;
    c = e.CONFIG_OPTIONS ? JSON.parse(e.CONFIG_OPTIONS) : {};
  } catch(err) {
    throw new Error("Unable to parse CONFIG_OPTIONS environment variable invalid JSON.");
  }

  ret = {
    account: d.account || e.CONFIG_ACCOUNT || c.account || e.AZURE_STORAGE_ACCOUNT || null,
    accountKey: d.accountKey || e.CONFIG_ACCOUNT_KEY || c.accountKey || e.AZURE_STORAGE_ACCESS_KEY || null,
    accountTable: d.accountTable || e.CONFIG_TABLE || c.accountTable || 'config',
    namespace: d.namespace || e.CONFIG_NS || c.namespace || 'default',
    environment: d.environment || e.CONFIG_ENV || c.environment || process.env.NODE_ENV || 'local'
  };

  return ret;
}


export function sanitize(options) {
  options = options || {};

  var d = get();

  var ret = {
    account: options.account || d.account,
    accountKey: options.accountKey || d.accountKey,
    accountTable: options.accountTable || d.accountTable,
    namespace: options.namespace || d.namespace,
    environment: options.environment || d.environment
  };

  if (!ret.account) throw new Error('Missing required setting for Azure Storage account (account).');
  if (!ret.accountKey) throw new Error('Missing required setting for Azure Storage account key (accountKey).');

  return ret;
}
