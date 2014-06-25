var should = require('should');

var MongoWrapper = require('../index');

describe('Basic functionalities', function(){
  it('should initialise', function(done){
    var mw = new MongoWrapper({});
    mw.should.have.properties( [
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
      'hint' ]
        );
    done();
  });
});



