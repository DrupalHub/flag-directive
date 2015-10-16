flag.directive('flagToggle', function($http, flagConfig, $rootScope) {
  return {
    restrict: 'E',
    template: '<i ng-class="class_element"></i><a href="#" ng-click="$event.preventDefault(); toggle()">{{text}}</a>',
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
      $scope.accessToken = $scope.token.accessToken;

      $scope.$watch('entityId', function(value) {
        if (+value == 0) {
          return;
        }

        var request = {
          method: 'get',
          url: flagConfig.server + $scope.endpoint + '?check_flagged&entity=' + $scope.entity + '&id=' + value,
          headers: {
            'access_token': $scope.accessToken,
            'access-token': $scope.accessToken
          }
        };

        $http(request).success(function(data) {
          $scope.alterText(data.data.length != 0);
        });
      });

      /**
       * Altering the text of the flag by the state of the flag.
       *
       * @param flagged
       *   Determine if the user flagged this entity or not.
       */
      $scope.alterText = function(flagged) {
        $scope.text = flagged ? $scope.textFlagged : $scope.textUnflagged;
        $scope.class_element = flagged ? $scope.classFlagged : $scope.classUnflagged;
      };

      /**
       * Toggle between the states of the flag.
       */
      $scope.toggle = function() {
        // Check if the current user already flagged the entity.
        var request = {
          method: 'get',
          url: flagConfig.server + $scope.endpoint + '?check_flagged&entity=' + $scope.entity + '&id=' + $scope.entityId,
          headers: {
            'access_token': $scope.accessToken,
            'access-token': $scope.accessToken
          }
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

        address = flagConfig.server + $scope.endpoint;
        if (data.count == 0) {
          type = 'post';
        }
        else {
          type = 'delete';
          address += '/' + $scope.entityId;
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
            entity_id: $scope.entityId
          },
          headers: {
            'access_token': $scope.accessToken,
            'access-token': $scope.accessToken
          }
        };

        $http(request).success(function(data) {
          $scope.alterText(data instanceof Object);
        });
      };
    }
  };
});
