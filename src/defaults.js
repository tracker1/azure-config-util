var d = {};

module.exports = getDefaults;
module.exports.set = setDefaults;

function setDefaults(options){
  d = options || {};
}

function getDefaults() {
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
    accountKey: d.accountKey || e.CONFIG_ACCOUNT_KEY || d.accountKey || c.accountKey || e.AZURE_STORAGE_ACCESS_KEY || null,
    accountTable: d.accountTable || e.CONFIG_TABLE || d.accountTable || c.accountTable || 'config',
    namespace: d.namespace || e.CONFIG_NS || d.namespace || c.namespace || 'default',
    environment: d.environment || e.CONFIG_ENV || d.environment || c.environment || process.env.NODE_ENV || 'local'
  };

  return ret;
}