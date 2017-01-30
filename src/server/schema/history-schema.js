'use strict';
const mongoose = require('mongoose');

const schema = {
  query: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
};

module.exports = {
  name: 'History',
  schema: new mongoose.Schema(schema),
  collection: 'histories',
  poObject: schema
};
