var flag  = angular.module('flagDirective', ['flagConfig']);

flag.directive('flag', function($http, flagConfig, $rootScope) {
  return {
    restrict: 'AE',
    template: '<a href="#" ng-click="$event.preventDefault(); like()"><span class="fa fa-thumbs-o-up" ng-bind="likes"></span></a>',
    scope: {
      type: '@',
      likes: '@',
      entity: '@',
      id: '@'
    },
    link: function($scope) {

      $scope.like = function() {

        // Define the variable for other listeners to alter.
        var token = {
          'accessToken': ''
        };
        $rootScope.$broadcast('flagAccessToken', token);

        // Check if the current user already flagged the entity.
        var request = {
          method: 'get',
          url: flagConfig.server + $scope.type + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.id,
          headers: {'access_token': token.accessToken}
        };

        $http(request).success(function(data) {
          var type, address;

          // Build the operation type.
          address = flagConfig.server + $scope.type;
          if (data.count == 0) {
            type = 'post';
          }
          else {
            type = 'delete';
            address += '/' + $scope.id;
          }

          var request = {
            method: type,
            url: address,
            data: {
              entity_type: $scope.entity,
              entity_id: $scope.id
            },
            headers: {
              'access_token': token.accessToken
            }
          };

          $http(request).success(function() {
            // Increase or decrease the likes number.
            if (type == 'post') {
              $scope.likes++;
            }
            else {
              $scope.likes = $scope.likes <= 1 ? 0 : $scope.likes--;
            }
          })
        });
      };
    }
  };
});
