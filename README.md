[![Build Status](https://travis-ci.org/harish2704/mongo-wrapper-pooled.svg?branch=master)](https://travis-ci.org/harish2704/mongo-wrapper-pooled)
mongo-wrapper-pooled
====================

A wrapper library around mongodb with connection pooling using generic-pool

# Usage

## Initialise

```js
var MongoWrapper = require('mongo-wrapper-pooled');
var settings = {
        host: 'localhost',
        port: '27017',
        db: 'testDb',
        maxPoolSize : 1,
        minPoolSize : 0,
        idleTimeoutMillis: 30000,
    };
var instance = new MongoWrapper( settings );

instance.findOne('collectionName', {userId: 'hari'}, console.log );
instance.findOne('collectionName', {userId: 'hari'}, { email: false}, console.log );
instance.find('collectionName', {active: True, $limit:20}, { email: false}, console.log );
// In general, instance.<CollectionMethod>( <CollectionName>, args... );
```

## Implemented methods 

All methods available to a Mongodb Collection is implemented.
For the convenience, the following methods do some more things
* ```find```: It returns an array instead of a databse cursor. array is the result of cursor.toArray(); If any of '$limit', '$sort', '$skip', '$fields' keys are present in the second argument, it is passed as argument to functions 'limit()', 'sort()', 'skip()', 'fields()' respectively before calling cursor.toArray().
