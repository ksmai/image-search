'use strict';
const https = require('https');
const config = require('../../config.json');
const BASE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1?' +
  'cx=' + (process.env.CUSTOM_SEARCH_INDEX || config.CUSTOM_SEARCH_INDEX) +
  '&key=' + (process.env.GOOGLE_API_KEY || config.GOOGLE_API_KEY) +
  '&searchType=image' + '&num=10';

module.exports = function(query, offset = 0) {
  var url = BASE_SEARCH_URL + '&q=' + query + '&start=' + (offset + 1);
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      if(res.statusCode !== 200) {
        reject();
      }
      else {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', function(data) {
          rawData += data;
        });
        res.on('end', function() {
          let parsedData;
          try {
            parsedData = JSON.parse(rawData)
                             .items
                             .map( (img) => ({
                                 context: img.image.contextLink,
                                 snippet: img.snippet,
                                 thumbnail: img.image.thumbnailLink,
                                 url: img.link
                             }) );
          }
          catch(e) {
            reject(e);
          }
          resolve(parsedData);
        });
      }
    });
  });
};
