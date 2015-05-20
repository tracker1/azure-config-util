import getConfig from './get-config';
import getStorage from './get-storage';
import getBlob from './get-blob';
import getQueue from './get-queue';
import getTable from './get-table';
import getSql from './get-sql';

export default function(options) {
  return {
    config:()=>getConfig(options)
    ,storage:(...argv)=>getStorage(options,...argv)
    ,blob:(...argv)=>getBlob(options,...argv)
    ,queue:(...argv)=>getQueue(options,...argv)
    ,table:(...argv)=>getTable(options,...argv)
    ,sql:(...argv)=>getSql(options,...argv)
  };
}
