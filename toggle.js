flag.directive('flagToggle', function($http, flagConfig, $rootScope) {
  return {
    restrict: 'E',
    template: '<a href="#" ng-click="$event.preventDefault(); toggle()"><i ng-class="class_element"></i> {{text}}</a>',
    scope: {
      endpoint: '@',
      textFlagged: '@',
      textUnflagged: '@',
      classFlagged: '@',
      classUnflagged: '@',
      entity: '@',
      entityId: '@'
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

      $scope.$watch('entityId', function(value) {
        if (+value == 0) {
          return;
        }

        console.log(flagConfig.server + $scope.endpoint + '?check_flagged&entity=' + $scope.entity + '&id=' + value);
        var request = {
          method: 'get',
          url: flagConfig.server + $scope.endpoint + '?check_flagged&entity=' + $scope.entity + '&id=' + value,
          headers: {'access_token': $scope.token.accessToken}
        };

        $http(request).success(function(data) {
          $scope.text = data.data.length == 0 ? $scope.textUnflagged : $scope.textFlagged;
          $scope.class_element = data.data.length == 0 ? $scope.classUnflagged : $scope.classFlagged;
        });
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
