require('cc-globals');
var loadConfig = require('./load-config');
var sanitizeOptions = require('./sanitize-options');

module.exports = createConfigurationGetter;

function createConfigurationGetter(options) {

  return getConfigPromise;

  function getConfigPromise(){
    try {
      options = sanitizeOptions(options);
      return loadConfig(options).then((cfg)=>{
        //attach options to final configuration object
        cfg._options = options;
        return cfg;
      });
    } catch(err) {
      return Promise.reject(err)
    }
  }

}
