var debug = require('debug')('azure-config-util');
var util = require('util');

module.exports = function() {
  if (!arguments.length) return;
  debug("[%s] %s", new Date().toISOString(), util.format.apply(util,arguments));
  return true;
};
