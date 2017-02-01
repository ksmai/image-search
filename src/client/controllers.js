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
    $scope.pending = false;
    $scope.error = false;
    $scope.query = decodeURIComponent($routeParams.query);

    $scope.search = function(query) {
      if($scope.pending) return;

      $scope.pending = true;
      $scope.error = false;
      $http({
        url: `/api/imagesearch/${encodeURIComponent(query)}?offset=${offset}`,
        method: 'GET'
      })
      .then(function(res) {
        $scope.pending = false;
        if(res.status === 200 && res.data.length) {
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
        $scope.pending = false;
        $scope.error = true;
      });
    };

    $scope.enter = function(evt) {
      if(evt.which === 13) {
        $scope.search( $scope.query );
      }
    };

    $scope.view = function(image) {
      $scope.modal = image;
    };

    $scope.close = function() {
      $scope.modal = null;
    };

    $scope.clearError = function() {
      $scope.error = false;
    };
  }
];
