/*jslint node: true, stupid: true*/
/*global describe, it, before, after */

var should = require('should');

var MongoWrapper = require('../index');

var implementedProps = [
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
  'find',
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
  'hint' ];

var mw = new MongoWrapper({
    host: '127.0.0.1'
});
var COLL = 'tests';
var data = require('./10.json');

describe('Basic methods', function(){
  before(function(done){
    mw.remove(COLL,{}, done );
  });

  after(function(done){
    mw.pool.destroyAllNow();
    done();
  });

  it('should initialise', function(done){
    mw.should.have.properties( implementedProps );
    done();
  });

  it('should insert data', function(done){
    mw.insert(COLL, data, function(err, docs){
      should.not.exist(err);
      should.exist(docs);
      docs.should.be.an.instanceOf( Array );
      docs.should.have.lengthOf( data.length );
      docs.forEach(function(v){
        v.should.have.property('_id');
      });
      done();
    });
  });

  describe('find method', function(){
    it('should find data with one argument', function(done){
      mw.find(COLL, {}, function(err, docs){
        should.not.exist(err);
        should.exist(docs);
        docs.should.be.an.instanceOf( Array );
        docs.should.have.lengthOf( data.length );
        docs.forEach(function(v){
          v.should.have.property('_id');
        });
        done();
      });
    });
    it('should find data with two arguments', function(done){
      mw.find(COLL, {}, {company: false, address: false}, function(err, docs){
        should.not.exist(err);
        should.exist(docs);
        docs.should.be.an.instanceOf( Array );
        docs.should.have.lengthOf( data.length );
        docs.forEach(function(v){
          v.should.have.property('_id');
          v.should.not.have.properties('company', 'address');
        });
        done();
      });
    });
  });

  describe('findOne method', function(){
    it('should findOne data with one argument', function(done){
      mw.findOne(COLL, { username: 'Geovany_Thiel' }, function(err, doc){
        should.not.exist(err);
        should.exist(doc);
        doc.should.have.properties('_id', 'name', 'username', 'name');
        done();
      });
    });
    it('should findOne data with two arguments', function(done){
      mw.findOne(COLL, { username: 'Geovany_Thiel' }, {address: false, company: false}, function(err, doc){
        should.not.exist(err);
        should.exist(doc);
        doc.should.have.properties('_id', 'name', 'username', 'name');
        doc.should.not.have.properties('company', 'address');
        done();
      });
    });
  });

  describe('remove method', function(){
    it('should remove data with one argument', function(done){
      mw.remove(COLL, { username: 'Geovany_Thiel' }, function(err, nums, stat){
        console.log( arguments );
        should.not.exist(err);
        should.exist( nums );
        // should.exist( stat );
        nums.should.be.equal(1);
        // stat.should.have.properties({ ok: true, n:1});
        done();
      });
    });
  });

});



