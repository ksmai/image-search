(function() {
  'use strict';
  const app = angular.module('imageSearch', ['ng', 'ngRoute']);
  const controllers = require('./controllers');
  for(let ctrl in controllers) {
    if(controllers.hasOwnProperty(ctrl)) {
      app.controller(ctrl, controllers[ctrl]);
    }
  }

  const directives = require('./directives');
  for(let di in directives) {
    if(directives.hasOwnProperty(di)) {
      app.directive(di, directives[di]);
    }
  }

  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
      .when('/', {
        templateUrl: '/templates/main-template.html'
      })
      .when('/search/:query', {
        template: '<search-page></search-page>'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('');
    }
  ]);
})();


