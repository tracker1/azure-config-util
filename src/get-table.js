import getStorage from './get-storage';
import getConfig from './get-config';

export {getTable as default};

async function getTable(options,name) {
  let cfg = await getConfig(options);
  options = cfg && cfg._options || options;

  let item = cfg && cfg.table && cfg.table[name];
  let storage = item && item.storage || 'default';
  let key = item && item.storageKey || null;
  name = item && item.name || name;

  return getStorage(storage,key).table(name);
}
