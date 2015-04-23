module.exports = sanitizeOptions;
var getDefaults = require('./defaults');

function sanitizeOptions(options) {
  options = options || {};

  var d = getDefaults();

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