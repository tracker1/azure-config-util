var getEnvs = require('./get-environments');
var itemToMapProp = (item)=>({[`${item.section}_${item.key}`]:item});
var propMapToItems = (items)=>R.values(items);

module.exports = parseRawConfig;

function parseRawConfig(options, items) {
  if (!options || !items) return Promise.reject(new Error("Options and Config are required."));
  if (!items.length) return Promise.resolve({}); //nothing to process

  var base = itemsForEnvs(getEnvs(options.environment),items);
  
  var ret = R.compose(
    R.mergeAll,
    R.map((section)=>getSectionItems(section,base)),
    R.uniq,
    R.map((item)=>item.section)
  )(base);

  return ret;
}


function getSectionItems(section,items) {
  var ret = R.compose(
    (item)=>({[section]:item}),
    R.mergeAll,
    R.map((item)=>({[item.key.toLowerCase()]:item.val})),
    R.filter((item)=>item.section === section)
  )(items);

  return ret;
}

function itemsForEnvs(envs,items) {
  var ret = R.compose(
    R.values,
    R.mergeAll,
    itemsForEnv(items),
    R.reverse
  )(envs);

  return ret;
}

function itemsForEnv(items) {
  return R.map((env)=>{
    return R.compose(
      R.mergeAll,
      R.map((item)=>{
        var key = `${item.section}_${item.key}`;
        return {[key]:item};
      }),
      R.filter((item)=>item.env===env)
    )(items);
  });
}