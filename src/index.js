import getConfig from './get-config';

export default function(options) {
  return {
    getConfig:()=>getConfig(options)
  };
}
