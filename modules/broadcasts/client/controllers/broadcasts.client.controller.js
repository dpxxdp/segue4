(function () {
  'use strict';

  // Broadcasts controller
  angular
    .module('broadcasts')
    .controller('BroadcastsController', BroadcastsController);

  BroadcastsController.$inject = ['$scope', '$state', 'Authentication', 'broadcastResolve'];

  function BroadcastsController ($scope, $state, Authentication, broadcast) {
    var vm = this;

    vm.authentication = Authentication;
    vm.broadcast = broadcast;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Broadcast
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.broadcastForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.broadcast._id) {
        vm.broadcast.$update(successCallback, errorCallback);
      } else {
        vm.broadcast.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('broadcasts.view', {
          broadcastId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
