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
// In general, instance.<CollectionMethod>( <CollectionName>, args... );
```

## Implemented methods 

All methods available to a Mongodb Collection is implemented.
For the convenience, the following methods do some more things
* ```find```: It returns an array instead of a databse cursor. array is the result of cursor.toArray();
