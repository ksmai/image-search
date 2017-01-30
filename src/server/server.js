'use strict';
const express = require('express');
const path = require('path');

const app = express();
const ASSET_PATH = path.join(__dirname, '../../asset/');
const BIN_PATH = path.join(__dirname, '../../bin/');

app.use(express.static(BIN_PATH));
app.use(express.static(ASSET_PATH));
app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: BIN_PATH
  });
});

app.use(function(err, req, res, next) {
  if(err) {
    res.status(500).end();
  }
});

module.exports = app;
