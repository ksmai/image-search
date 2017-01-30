'use strict';
const express = require('express');
const db = require('./db');
const googleImageSearch = require('./g-img');

module.exports = function() {
  const api = express.Router();

  api.get('/latest/imagesearch', function(req, res) {
    db.getLatestHistory()
      .then(
        function(data) {
          res.json(data).end();
        },
        function(err) {
          res.status(400).json({error: err.toString()}).end();
        }
      );
  });

  api.get('/imagesearch/:q', function(req, res) {
    var query = req.params.q;
    var offset = parseInt(req.query.offset) || 0;
    db.logSearchHistory(query);
    googleImageSearch(query, offset)
    .then(
      function(data) {
        res.json(data).end();
      },
      function(err) {
        var msg = err ? err.toString() : '';
        res.status(400).json({error: msg}).end();
      }
    );
  });

  api.use(function(err, req, res, next) {
    res.status(500).end();
  });

  return api;
};
