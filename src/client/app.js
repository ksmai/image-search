(function() {
  'use strict';
  const app = angular.module('imageSearch', ['ng', 'ngRoute']);


  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
      .when('/', {
        templateUrl: '/templates/main-template.html'
      })
      .when('/search/:query', {
        templateUrl: '/templates/search-template.html'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('');
    }
  ]);
})();


