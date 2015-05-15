import R from 'ramda';

let unflattenResults = (results)=>{
  var ret = {};
  results.forEach((item)=>{
    let {section,key,value} = item;
    ret[section] = ret[section] || {};
    ret[section][key] = value;
  });
  return ret;
}

let envItemsToObject = R.compose(
  R.mergeAll,
  R.map((item)=>{
    var key = `${item.section}\x1E${item.key}`;
    return {[key]:item};
  }),
  R.map((item)=>{
    let section = item.Section.toString().trim().toLowerCase();
    let key = item.Key.toString().trim().toLowerCase();
    let value = item.JsonValue;
    return {section,key,value};
  })
);

let reduceEnvs = R.compose(
  unflattenResults,
  R.values,
  R.mergeAll,
  R.reverse,
  R.map(envItemsToObject)
);

export default function(envResults){
  return reduceEnvs(envResults);
}
