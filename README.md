# azure-config-util

This library will use an Azure Table in order to generate/cache/refresh configuration objects.  This library does *NOT* encrypt line item records, you may wish to fork, or wrap this module with one that will.

![Data Image](http://i.imgur.com/XYoM8CY.png)

*Screenshot of [Azure Storage Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) with sample configuration*

## Installation

```
npm install --save azure-config-util
```

## Usage

The parameters shown here are optional, and the appropriate environment variables you can use are noted.

```js
// default || CONFIG_ACCOUNT || CONFIG_OPTIONS.account || AZURE_STORAGE_ACCOUNT
var account = `myazurestorageaccount`;

// default || CONFIG_ACCOUNT_KEY || CONFIG_OPTIONS.accountKey ||  AZURE_STORAGE_ACCESS_KEY
var accountKey = 'key-for-storage-account';

// default || CONFIG_TABLE || 'config'
var accountTable = 'tablename';

// default || CONFIG_NS || 'default'
var namespace = 'my-application';

// default || CONFIG_ENV || NODE_ENV || 'local'
var environment = 'production';

// JSON.parse(CONFIG_OPTIONS)
var configOptions = {
  account: account,
  accountKey: accountKey,
  accountTable: accountTable,
  namespace: namespace, 
  environment: environment,
}

// You need to run the method the module returns to create a configuration fetcher
var azure = require('azure-config-util')(configOptions);

...

// always use getConfig,
//   this will return a promise resolving to the *current* configuration
//   the module will refresh itself every 5 minutes

// getConfig will return a promise
azureUtil.getConfig()
  .then(function(config){
    // use configuration
    //  section is the "Section" in the Azure Table
    //  key is the "Key" in the Azure Table
    //  value is the JSON.parse'd "JsonValue" in Azure Table
    var value = config.section.key
  })
  .catch(function(err){
    //error getting configuration, only raised on first attempt
    //if first load is successful, reload errors will be suppressed behind the scenes
  });

```

NOTE: If you would like to set certain defaults globally for the module...

```
require('azure-config-util/defaults').set(configOptions);
```


## Configuration Options

### account

The name of the Azure Storage Account.

### accountKey

The key for the Azure Storage Account


### accountTable 

The Azure Table to use, which should be configured as follows (there is not yet a UI to interact with this, you can use [Azure Storage Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) to generate your records, and/or import from CSV.

```
PartitionKey: "namespace_environment"
RowKey:       "namespace_environment_section_sectionKey"
Namespace:    "namespace"
Environment:  "environment"
Section:      "section"
Key:          "sectionKey"
JsonValue:    JSON.stringify(configurationValue) //JSON.parse'd in config
```

The partition key, and rowkey aren't enforced, an actual query against the `Namespace` field is run to return all available options for that namespace 

`JsonValue` will be a string which will be parsed via `JSON.parse` and brought into the configuration.


### namespace

The application/suite namespace to isolate your configuration to.

### environment

If an entry is set to an `Environment` that matches the `hostname`, that value will be used as a priority.  If there is an entry set to an `Environment` of `default` that value will be used as a fallback.

Allowed values:

* `local` (default)
  * priority: [`hostname`, `local`, `development`, `dev`, `default`]
* `development` or `dev`
  * priority: [`hostname`, `development`, `dev`, `default`]
* `testing` or `test`
  * priority: [`hostname`, `testing`, `test`, `default`]
* `qa`
  * priority: [`hostname`, `qa`, `default`]
* `staging` or `stage`
  * priority: [`hostname`, `staging`, `stage`, `default`] 
* `production` or `prod`
  * priority: [`hostname`, `production`, `prod`, `default`]


## From 2.0

* This module will no longer leak globals.
* The main method of this module won't return the getConfig method directly, it's now an object.
* For [azure-storage-simple](https://www.npmjs.com/package/azure-storage-simple), `require('azure-config-util/azure-storage-simple')` 
* For [azure-storage](https://www.npmjs.com/package/azure-storage), `require('azure-config-util/azure-storage')`

### azure-storage-simple Wrappers (coming soon)

The following will be exposed as simple methods that will resolve a configuration and return the appropriate item from [azure-storage-simple](https://www.npmjs.com/package/azure-storage-simple).

* getStorage(storageAccountName)
  * Will return the underlying member for `azure-storage-simple` bound to the configured options
    * Section: `storage`
    * Key: storageAccountName
    * JsonValue: {key:'account-key'} 
* getQueue(queueKeyName)
  * Will return the underlying member for `azure-storage-simple` bound to the configured options
    * Section: `queue`
    * Key: *queueKeyName*
    * JsonValue: `{store:'storageAccountName',name:'queueNameToUse'} `
* getTable(tableKeyName)
  * Will return the underlying member for `azure-storage-simple` bound to the configured options
    * Section: `table`
    * Key: *tableKeyName*
    * JsonValue: {store:'storageAccountName',name:'tableNameToUse'} 
* getBlob('name')
  * Will return the underlying member for `azure-storage-simple` bound to the configured options
    * Section: `queue`
    * Key: *tableKeyName*
    * JsonValue: {store:'storageAccountName',name:'tableNameToUse'} 

### mssql-ng Wrapper (optional dependency)

You must `npm install` [mssql-ng](https://www.npmjs.com/package/mssql-ng) separately.

* getSql(sqlKeyName) returns Promise
  * Will return a configured [mssql-ng](https://www.npmjs.com/package/mssql-ng) object configured for looked up configuration
    * Section: `sql`
    * Key: *sqlKeyName*
    * JsonValue: configuration for [mssql](https://www.npmjs.com/package/mssql)

### ElasticSearch Wrapper (optional dependency)

You must `npm install` [elasticsearch](https://www.npmjs.com/package/mssql-ng) separately.

* getEsClient(elasticsearchKeyName)
  * Will return a configured elasticsearch client.
    * Section: `elasticsearch`
    * Key: *elasticsearchKeyName*
    * JsonValue: Options used for an elasticsearch client, including hosts.
* getEsIndex(esindexKeyName)
  * Will return a simple wrapper for elasticsearch.
    * Section: `esindex`
    * Key: *esindexKeyName*
    * JsonValue: `{server:elasticsearchKeyName},index:String,type:String}`
      * server: used with getEsClient( elasticsearchKeyName)


### Other Wrappers

I'm considering adding the following wrappers... (optional dependencies)

* Azure Search
* MySQL
* PostgreSQL
* MongoDB
* RethinkDB


## License

This software is distributed under the [ISC License](http://opensource.org/licenses/ISC).

```
Copyright (c) 2015, Michael J. Ryan <tracker1@gmail.com>
Copyright (c) 2015, ClassicCars.com

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
