import azure from 'azure-storage-simple';
import getConfig from './get-config';

export {getStorage as default};

async function getStorage(options,account,key) {
  //passed an explicit acccount and key, use it
  if (typeof account === 'string' && typeof key === 'string') return azure(account,key);

  //connection-string, use it
  if ((/\baccountname\b\s*\=\s*/i).test(account)) return azure(account);

  //lookup the account details based on the configuration
  var cfg = await getConfig(options);
  options = cfg && cfg._options || options;

  account = account || 'default';
  var storage = cfg && cfg.storage && cfg.storage[account] && cfg.storage[account].account || null;
  var key = cfg && cfg.storage && cfg.storage[account] && cfg.storage[account].key || null;

  //if default, without a matching storage and key, use options
  if (account === 'default' && !(storage && key)) {
    storage = options && options.account;
    key = options && options.key;
  }

  //no storage and key, throw error
  if (!storage) {
    throw new Error(`No matching storage configuration for "${account}"`);
  }

  //return underlying azure object
  return azure(storage,key);
}
