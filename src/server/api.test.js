'use strict';
const api = require('./api');
const assert = require('chai').assert;
const db = require('./db');
const express = require('express');
const superagent = require('superagent');

const PORT = 3001;
const BASE_URL = 'http://localhost:' + PORT;

describe('API endpoints', function() {
  var server;

  before(function(done) {
    const app = express();
    app.use(api());
    server = app.listen(PORT, function() {
      done();
    });
  });

  after(function(done) {
    db.disconnect()
    .then(function() {
      server.close(function() {
        done();
      });
    });
  });

  it('respond to /latest/imagesearch', function(done) {
    superagent
      .get(BASE_URL + '/latest/imagesearch')
      .end( function(err, res) {
        assert.ifError(err);
        assert.equal(res.status, 200);
        var data;
        assert.doesNotThrow(function() {
          data = JSON.parse(res.text);
        });
        assert.isOk(Array.isArray(data));
        assert.isOk( data.length <= 10 );
        data.forEach( history => {
          assert.lengthOf( Object.getOwnPropertyNames(history), 2 );
          assert.property(history, 'query');
          assert.property(history, 'time');
        } );
        done();
      } );
  });

  it('log queries for image search sequentially', function(done) {
    const query = "some random query";
    superagent
      .get(BASE_URL + '/imagesearch/' + query)
      .end( function(err, res) {
        assert.ifError(err);
        superagent
          .get(BASE_URL + '/latest/imagesearch')
          .end( function(err, res) {
            assert.ifError(err);
            var data;
            assert.doesNotThrow(function() {
              data = JSON.parse(res.text);
            });
            assert.property( data, '0' );
            assert.property( data[0], 'query');
            assert.equal( data[0].query, query );
            done();
          });
      });
  });

  it('respond to /imagesearch/:query', function(done) {
    const query = 'cute little kittens';
    superagent
      .get(BASE_URL + '/imagesearch/' + query)
      .end( function(err, res) {
        assert.ifError(err);
        var data;
        assert.doesNotThrow( function() {
          data = JSON.parse(res.text);
        } );
        assert.isOk( Array.isArray(data) );
        data.forEach( function(img) {
          assert.property(img, 'context');
          assert.property(img, 'url');
          assert.property(img, 'snippet');
          assert.property(img, 'thumbnail');
        } );
        done();
      });
  });

  it('calculate offset correctly', function(done) {
    const query = 'puppy';
    var offset, results, offsetResults;
    superagent
      .get(BASE_URL + '/imagesearch/' + query)
      .end( function(err, res) {
        assert.ifError(err);
        assert.doesNotThrow( function() {
          results = JSON.parse(res.text);
        } );
        assert.property( results, 'length' );
        offset = Math.floor(results.length / 2);
        superagent
          .get(`${BASE_URL}/imagesearch/${query}?offset=${offset}`)
          .end( function(err, res) {
            assert.ifError(err);
            assert.doesNotThrow( function() {
              offsetResults = JSON.parse(res.text);
            } );
            assert.property( offsetResults, 'length' );
            assert.isOk( offsetResults.length >= results.length - offset );
            for(let i = offset; i < results.length; i++) {
              assert.deepEqual( results[i], offsetResults[i - offset] );
            }
            done();
          } );

      } );
  });

});
  
