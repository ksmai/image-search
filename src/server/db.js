'use strict';
const mongoose = require('mongoose');
const config = require('../../config.json');
const schemas = require('./schema');
const DATABASE_URL = process.env.DATABASE_URL ||
                     config.DATABASE_URL ||
                     'mongodb://localhost:27017/test';

mongoose.Promise = Promise;

mongoose.connect(DATABASE_URL);

var models = Object.create(null);
for(let schema of schemas) {
  models[schema.name] = mongoose.model(
    schema.name, schema.schema, schema.collection
  );
}

module.exports = {
  disconnect() {
    return mongoose.disconnect();
  },
  getLatestHistory() {
    return models.History.find({}, {_id: 0, query: 1, time: 1})
                 .sort({time: -1})
                 .limit(10)
                 .exec();
  },
  logSearchHistory(query) {
    return new models.History({query}).save();
  }
};
