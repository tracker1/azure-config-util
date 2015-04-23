# azure-config-util

This library will use an Azure Table in order to generate/cache/refresh configuration objects.  This library does *NOTE* encrypt line item records, you may wish to wrap this module with one that will.

**SIDE-EFFECT:** This module uses `cc-globals` which will load the following global variables `R` (ramda), `fetch` (isomorphic-fetch) and `Promise` (bluebird, overrides native).  Bluebird is better performing and more feature rich than native promises.

*WARNING: Due to sparse documentation, I am uncertain if the underlying Azure Storage client for node will return more than 1000 records at a time (querying on Namespace).  If you need more than that many entries for your namespace/application you should test for this case.*


![Data Image](http://i.imgur.com/aN7E8Lg.png)

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
var getConfig = require('azure-config-util')(configOptions);

...

// always use getConfig,
//   this will return a promise resolving to the *current* configuration
//   the module will refresh itself every 5 minutes

//getConfig will return a promise
getConfig()
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

*WARINING: unsure if the node client will return more than the `1000` record limit*


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
