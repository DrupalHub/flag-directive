var flag  = angular.module('flagDirective', ['flagConfig']);

flag.directive('flag', function($http, flagConfig) {
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
        $http({
          method: 'post',
          url: flagConfig.server + $scope.type,
          data: {
            entity_type: $scope.entity,
            entity_id: $scope.id
          },
          headers: {'access_token': flagConfig.access_token}
        }).
          success(function(data) {
            console.log(data);
            $scope.likes++;
          }).
          error(function(data) {
            console.log(data);
          });
      }
    }
  };
});
