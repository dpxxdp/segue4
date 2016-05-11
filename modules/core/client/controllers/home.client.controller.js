'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.learnMoreClicked = false;

    $scope.onLearnMoreClick = function() {
      $scope.learnMoreClicked = true;
    };

  }
]);
