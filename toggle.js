flag.directive('flagToggle', function($http, flagConfig, $rootScope) {
  return {
    restrict: 'AE',
    template: '<a href="#" ng-click="$event.preventDefault(); toggle()" ng-bind="text">text</a>',
    scope: {
      type: '@',
      text_flagged: '@',
      text_unflagged: '@',
      class_flagged: '@',
      class_unflagged: '@',
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

      // Set up the flag value.
      $rootScope.$broadcast('flagAccessToken', $scope.token);

      $scope.text = 'foo';

      var request = {
        method: 'get',
        url: flagConfig.server + $scope.type + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.id,
        headers: {'access_token': $scope.token.accessToken}
      };

      $http(request).success(function(data) {
        console.log(data);
      });

      /**
       * Like a specific entity.
       */
      $scope.toggle = function() {

        // Get the token from other controllers.
        $rootScope.$broadcast('flagAccessToken', $scope.token);

        // Check if the current user already flagged the entity.
        var request = {
          method: 'get',
          url: flagConfig.server + $scope.type + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.id,
          headers: {'access_token': $scope.token.accessToken}
        };

        $http(request).success(function(data) {
          $scope.updateDirective($scope.getActions(data));
        });
      };

      /**
       * Build the operation type.
       *
       * @returns {{type: *, address: *}}
       */
      $scope.getActions = function(data) {
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
      $scope.updateDirective = function(results) {
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
