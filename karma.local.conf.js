'use strict';

module.exports = function(config) {
  config.set({
    files: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
   'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-mocks.js',
 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.min.js',
      './bin/app.js',
      './test.js',
      {pattern: './bin/templates/*.html', included: false, served: true}
    ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    port: 9876,
    proxies: {
      '/templates/': 'http://localhost:9876/base/bin/templates/'
    }
  });
};
