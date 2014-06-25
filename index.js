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
        db: settings.db|| 'airnb',
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

MongoWrapper.prototype.acquire = function( cb ){
    var self = this;
    self.pool.acquire( function(err, db ){
        var done = function( ){
            self.pool.release( db );
        };
        return cb(err, db, done );
    });
};


MongoWrapper.prototype.q = function( fn, cb){
    var self = this;
    async.waterfall([
            function(cb){ return self.acquire(cb); },
            function(db, done, cb){ 
                return fn(db, function(err, doc){
                    done();
                    return cb(err, doc);
                });
            },
            ], cb );
};
MongoWrapper.prototype.find = function(collection, data, cb){
    var fn = function(db, cb){
        async.waterfall([
                function(cb){ return db.collection(collection).find( data, cb ); },
                function(cur, cb){ return cur.toArray(cb); },
                ], cb );
    };
    this.q(fn, cb);
};

var getFn = function( collection, data, method ){
    return function(db, cb){
        return db.collection(collection)[method](data, cb );
    };
};

var mongoMethods = [
    'insert',
    'save',
    'findOne',
    'remove',
    ];

mongoMethods.forEach(function(v){
    MongoWrapper.prototype[v] = function(collection, data, cb){
    this.q( getFn(collection, data, v), cb);
    };
});


module.exports = MongoWrapper;

