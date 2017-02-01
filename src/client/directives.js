'use strict';

exports.searchBox = function() {
  return {
    templateUrl: '/templates/search-box-template.html',
    controller: 'searchBoxCtrl',
    restrict: 'E',
    scope: {
      initialValue: '@initialValue',
      search: '&search',
      enter: '&enter'
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

exports.modal = function() {
  return {
    restrict: 'E',
    scope: {
      close: '&'
    },
    transclude: {
      title: 'modalTitle',
      body: 'modalBody',
      footer: 'modalFooter'
    },
    templateUrl: '/templates/modal-template.html'
  };
};

exports.searchPage = function() {
  return {
    templateUrl: '/templates/search-template.html',
    controller: 'searchCtrl'
  };
};
