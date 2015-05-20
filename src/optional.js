export default function(name) {
  try {
    return require(name);
  } catch(err) {
    return null;
  }
}