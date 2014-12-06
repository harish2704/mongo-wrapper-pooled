var MongoClient = require('mongodb').MongoClient;
var poolModule = require('generic-pool');
var async = require('async');
var util = require('util');


var mongodbUrl = 'mongodb://%s:%s/%s';
var createPool = function(settings){
    settings = settings||{};
    settings = {
        host: settings.host|| 'localhost',
        port: settings.port|| '27017',
        db: settings.db|| 'testDb',
        maxPoolSize : settings.maxPoolSize != null ? settings.maxPoolSize : 1,
        minPoolSize : settings.minPoolSize != null ? settings.minPoolSize : 0,
        idleTimeoutMillis: settings.idleTimeoutMillis|| 30000,
    };
    var connectionUrl = util.format( mongodbUrl, settings.host, settings.port, settings.db );
    var pool = poolModule.Pool({
        name     : 'mongodb',
        create   : function(callback) {
            return MongoClient.connect( connectionUrl, callback );
        },
        destroy  : function(db) { db.close(); },
        max      : settings.maxPoolSize,
        min      : settings.minPoolSize, 
        idleTimeoutMillis : settings.idleTimeoutMillis,
    });
    return pool;
};



function MongoWrapper ( settings ){
    this.pool = createPool( settings );
}



var getFn = function(method){
    return function(collection){
        var self = this;
        var args = [].slice.call(arguments, 1);
        var origCb = args[ args.length -1 ];
        this.pool.acquire(function(err, db){
            if(err) return origCb(err);
            var cb = function( ) {
                self.pool.release(db);
                return origCb.apply(origCb, arguments );
            };
            args[ args.length -1 ] = cb;
            var coll = db.collection(collection);
            coll[method].apply(coll, args );
        });
    };
};


var mongoMethods = [
    'insert',
    'remove',
    'rename',
    'save',
    'update',
    'distinct',
    'count',
    'drop',
    'findAndModify',
    'findAndRemove',
    // 'find',
    'findOne',
    'createIndex',
    'ensureIndex',
    'indexInformation',
    'dropIndex',
    'dropAllIndexes',
    'dropIndexes',
    'reIndex',
    'mapReduce',
    'group',
    'options',
    'isCapped',
    'indexExists',
    'geoNear',
    'geoHaystackSearch',
    'indexes',
    'aggregate',
    'stats',
    'hint'
];

mongoMethods.forEach( function(m){
    MongoWrapper.prototype[m] = getFn(m);
});


MongoWrapper.prototype.find = function(collection){
    var self = this;
    var args = [].slice.call(arguments, 1);
    var origCb = args.pop();
    this.pool.acquire(function(err, db){
        if(err) return origCb(err);
        var cb = function( ) {
            self.pool.release(db);
            return origCb.apply(origCb, arguments );
        };
        var coll = db.collection(collection);
        return async.waterfall([
            function( cb){ args.push(cb); return  coll.find.apply(coll, args ); },
            function( cursor, cb){ return  cursor.toArray( cb ); },
            ], cb );
    });
}

module.exports = MongoWrapper;

