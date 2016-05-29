'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.learnMoreClicked = false;

    $scope.onLearnMoreClick = function() {
      $scope.learnMoreClicked = true;
    };
    
    $scope.entry = {
      passcode: '',
      error: '',
      success: ''
    }
    
    $scope.submitEntry = function() {
      if(!$scope.entry.passcode) {
        $scope.entry.error = '...you can\'t launch without a launch code'
      } else if($scope.entry.passcode != 'test') {
        $scope.entry.error = '2'
        $scope.entry.success = '';
        $scope.entry.passcode = '';
      } else {
        $scope.entry.success = '20';
        $scope.entry.error = '';
      }
    }

  }
]);
