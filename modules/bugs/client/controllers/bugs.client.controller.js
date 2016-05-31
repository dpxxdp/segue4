(function () {
  'use strict';

  // Bugs controller
  angular
    .module('bugs')
    .controller('BugsController', BugsController);

  BugsController.$inject = ['$scope', '$state', 'Authentication', 'bugResolve'];

  function BugsController ($scope, $state, Authentication, bug) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bug = bug;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Bug
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.bug.$remove($state.go('bugs.list'));
      }
    }

    // Save Bug
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bugForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bug._id) {
        vm.bug.$update(successCallback, errorCallback);
      } else {
        vm.bug.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('bugs.view', {
          bugId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
