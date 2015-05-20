import getStorage from './get-storage';
import getConfig from './get-config';

export {getQueue as default};

async function getQueue(options,name) {
  let cfg = await getConfig(options);
  options = cfg && cfg._options || options;

  let item = cfg && cfg.queue && cfg.queue[name];
  let storage = item && item.storage || 'default';
  let key = item && item.storageKey || null;
  name = item && item.name || name;

  return getStorage(storage,key).queue(name);
}
