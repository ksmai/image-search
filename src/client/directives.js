'use strict';

exports.searchBox = function() {
  return {
    templateUrl: '/templates/search-box-template.html',
    controller: 'searchBoxCtrl',
    restrict: 'E',
    scope: {
      initialValue: '@initialValue',
      search: '&search'
    }
  };
};

exports.autoFocus = ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(_scope, _element) {
      $timeout(function() {
        _element[0].focus();
      }, 0);
    }
  };
}];
