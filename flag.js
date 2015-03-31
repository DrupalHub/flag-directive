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

        var request = {
          method: 'get',
          url: flagConfig.server + $scope.type + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.id,
          headers: {'access_token': token.accessToken}
        };

        $http(request).success(function(data) {
          var type = data.count == 0 ? 'post' : 'delete';

          var request = {
            method: type,
            url: flagConfig.server + $scope.type,
            data: {
              entity_type: $scope.entity,
              entity_id: $scope.id
            },
            headers: {'access_token': token.accessToken}
          };

          $http(request).success(function(data) {
            // Increase numbers.
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
