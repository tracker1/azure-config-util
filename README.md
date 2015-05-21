# azure-config-util

***NOW SHOWING VERSION 2.x DOCUMENTATION - UNDER DEVELOPMENT - NOT IN NPM***

This module serves two purposes:

1. Make it easy to use an Azure Storage Table for shared configuration values, with a caching client.
2. Make it easy to use the shared configuration in order to utilize related services.

This library will use an Azure Table in order to generate/cache/refresh configuration objects.  This library does *NOT* encrypt line item configuration records.  Version 3 will add encrypted values, as well as command-line utilities for backing up and restoring config table values.


## Installation

```
npm install --save azure-config-util
```

## Usage

Configuration values will be determined and deconstructed from a [configured table](https://github.com/tracker1/azure-config-util/wiki/ConfigurationTable), using [specified configuration options and/or environment variables](https://github.com/tracker1/azure-config-util/wiki/ConfigurationOptions).

The behavior changes from 0.x-1.x in that it will now return a wrapper, and not a resolver/promise method for configuration.

```js
// You need to run the method the module returns to create a configuration fetcher
var azureUtil = require('azure-config-util')(configOptions);
```

## Instance Methods

The current utility methods/wrappers are those that I have needed either for configuration directly, or for use with Azure services.  I welcome other optional dependencies and related wrappers/methods for other libraries.

### Configuration

The configuration object resolution is the basis of this module, all other methods use the configuration to determine connection parameters.

* [.config()](https://github.com/tracker1/azure-config-util/wiki/GetConfigurationMethod)
  * Promise resolves to current configuration object (caching)

### Azure Storage

In order to better utilize azure storage, the following utility methods are written in order to access [azure-storage-simple](https://www.npmjs.com/package/azure-storage-simple) wrappers.

* [.storage(name)](https://github.com/tracker1/azure-config-util/wiki/GetStorageMethod)
  * Promise resolves to named Azure Storage wrapper
* [.blob(name)](https://github.com/tracker1/azure-config-util/wiki/GetBlobMethod)
  * Promise resolves to named Azure Storage Container wrapper
* [.queue(name)](https://github.com/tracker1/azure-config-util/wiki/GetQueueMethod)
  * Promise resolves to named Azure Storage Queue wrapper
* [.table(name)](https://github.com/tracker1/azure-config-util/wiki/GetTableMethod/)
  * Promise resolves to named Azure Storage Table wrapper

### Azure SQL & Microsoft SQL

You must `npm install` [mssql-ng](https://www.npmjs.com/package/mssql-ng) and [mssql](https://www.npmjs.com/package/mssql) separately from this module.


* [.sql(name)](https://github.com/tracker1/azure-config-util/wiki/GetSqlMethod)
  * Promise resolves to named [mssql-ng](https://www.npmjs.com/package/mssql-ng) connection.


### ElasticSearch (Coming Soon)

You must `npm install` [elasticsearch](https://www.npmjs.com/package/elasticsearch) separately.

* .es.client(keyName)
  * Will return a configured elasticsearch client.
    * Section: `elasticsearch`
    * Key: *elasticsearchKeyName*
    * JsonValue: Options used for an elasticsearch client, including hosts.
* .es.index(indexKeyName)
  * Will return a simple wrapper for elasticsearch.
    * Section: `esindex`
    * Key: *esindexKeyName*
    * JsonValue: `{server:elasticsearchKeyName},index:String,type:String}`
      * server: used with getEsClient(elasticsearchKeyName)

### Other Libraries

Other libraries should ideally implement connection pooling (as needed), and/or use [repromise](https://www.npmjs.com/package/repromise) to implement a retry mechanism.  Not to mention preference to a promises based implementation.

SQL database libraries (mysql, postrgresql, etc), should ideally be wrapped with something similar the the `mssql-ng` wrapper to provide template processing, and promise based results, and transparent connection pooling.


## Configuration Data

For now, it's best to use [Azure Storage Explorer](http://www.cerebrata.com/products/azure-explorer/introduction) (*screenshot below*) to edit your configuration values directly.

![Data Image](http://i.imgur.com/XYoM8CY.png)


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
