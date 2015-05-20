import getStorage from './get-storage';
import getConfig from './get-config';

export {getBlob as default};

async function getBlob(options,name) {
  let cfg = await getConfig(options);
  options = cfg && cfg._options || options;

  let item = cfg && cfg.blob && cfg.blob[name];
  let storage = item && item.storage || 'default';
  let key = item && item.storageKey || null;
  name = item && item.name || name;

  return getStorage(storage,key).blob(name);
}
