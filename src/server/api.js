'use strict';
const express = require('express');
const db = require('./db');

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
    var offset = req.query.offset;
    db.logSearchHistory(query)
      .then(
        function() {
          res.send('success').end();
        },
        function(err) {
          res.status(400).json({error: err.toString()}).end();
        }
      );
  });

  api.use(function(err, req, res, next) {
    res.status(500).end();
  });

  return api;
};
