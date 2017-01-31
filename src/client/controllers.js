'use strict';

exports.searchBoxCtrl = ['$scope', '$location',
  function($scope, $location) {
    $scope.inputValue = $scope.initialValue;
    $scope.changeQuery = function() {
      if(!$scope.inputValue.match(/^\.{1,2}$/)) {
        $location.path(`/search/${encodeURIComponent($scope.inputValue)}`);
      }
    };
  }
];

exports.searchCtrl = ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    var offset = 0;
    $scope.query = decodeURIComponent($routeParams.query);
    $scope.search = function(query) {
      $http({
        url: `/api/imagesearch/${encodeURIComponent(query)}?offset=${offset}`,
        method: 'GET'
      })
      .then(function(res) {
        if(res.status === 200) {
          if(Array.isArray($scope.images)) {
            $scope.images = $scope.images.concat(res.data);
          }
          else {
            $scope.images = res.data;
          }
          offset += 10;
        }
        else {
          return Promise.reject(res);
        }
      })
      .catch(function(err) {
      });
    };

    $scope.view = function(image) {
      $scope.modal = image;
    };
  }
];
