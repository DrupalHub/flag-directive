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

      /**
       * Holds the access token for other controllers to change.
       *
       * @type {{accessToken: string}}
       */
      $scope.token = {
        'accessToken': ''
      };

      /**
       * Like a specific entity.
       */
      $scope.like = function() {

        // Get the token from other controllers.
        $rootScope.$broadcast('flagAccessToken', $scope.token);

        // Check if the current user already flagged the entity.
        var request = {
          method: 'get',
          url: flagConfig.server + $scope.type + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.id,
          headers: {'access_token': $scope.token.accessToken}
        };

        $http(request).success(function(data) {
          this.updateDirective(this.getActions(data));

        });
      };

      /**
       * Build the operation type.
       *
       * @returns {{type: *, address: *}}
       */
      this.getActions = function(data) {
        var type, address;

        address = flagConfig.server + $scope.type;
        if (data.count == 0) {
          type = 'post';
        }
        else {
          type = 'delete';
          address += '/' + $scope.id;
        }

        return {
          type: type,
          address: address
        };
      };

      /**
       * Increase or decrease the likes number.
       *
       * @param results
       *   The results from getActions function.
       */
      this.updateDirective = function(results) {
        var request = {
          method: results.type,
          url: results.address,
          data: {
            entity_type: $scope.entity,
            entity_id: $scope.id
          },
          headers: {
            'access_token': $scope.token.accessToken
          }
        };

        $http(request).success(function() {
          if (results.type == 'post') {
            $scope.likes++;
          }
          else {
            $scope.likes = $scope.likes <= 1 ? 0 : $scope.likes--;
          }
        });
      };
    }
  };
});
