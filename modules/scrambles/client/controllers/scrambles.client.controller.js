(function () {
  'use strict';

  // Scrambles controller
  angular
    .module('scrambles')
    .controller('ScramblesController', ScramblesController);

  ScramblesController.$inject = ['$scope', '$state', 'Authentication', 'scrambleResolve'];

  function ScramblesController($scope, $state, Authentication, scramble) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pt = '';
    vm.k = '';
    vm.scramble = scramble;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.setKeyDialog = false;
    vm.secureForPost = false;
    vm.viewPt = false;
    vm.dcError = '';

    $scope.fe = function () {
      vm.scramble.content = CryptoJS.AES.encrypt(vm.pt, 'test').toString();
    };

    $scope.dc = function () {
      var bytes = CryptoJS.AES.decrypt(vm.scramble.content, vm.k);
      vm.dcError = 'Wrong key';
      vm.pt = bytes.toString(CryptoJS.enc.Utf8);
      if (vm.pt) {
        vm.viewPt = true;
        vm.k = '';
        vm.k = 'rewriting';
        vm.k = 'rewriting..';
        vm.k = 'rewriting...';
        vm.k = '';
        vm.dcError = '';
      }
    };

    $scope.openSetKeyDialog = function () {
      vm.setKeyDialog = true;
    };

    $scope.secure = function () {
      vm.pt = '';
      vm.pt = 'rewriting';
      vm.pt = 'rewriting.';
      vm.pt = 'rewriting..';
      vm.pt = 'rewriting...';
      vm.pt = '';
      vm.k = '';
      vm.k = 'rewriting';
      vm.k = 'rewriting..';
      vm.k = 'rewriting...';
      vm.k = '';
      vm.viewPt = false;
    };

    $scope.eAndS = function () {
      vm.scramble.content = CryptoJS.AES.encrypt(vm.pt, vm.k).toString();
      vm.pt = '';
      vm.pt = 'rewriting';
      vm.pt = 'rewriting.';
      vm.pt = 'rewriting..';
      vm.pt = 'rewriting...';
      vm.pt = '';
      vm.k = '';
      vm.k = 'rewriting';
      vm.k = 'rewriting..';
      vm.k = 'rewriting...';
      vm.k = '';
      vm.secureForPost = true;
    };

    // Remove existing Scramble
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.scramble.$remove($state.go('scrambles.list'));
      }
    }

    // Save Scramble
    function save() {

      // TODO: move create/update logic to service
      if (vm.scramble._id) {
        vm.scramble.$update(successCallback, errorCallback);
      } else {
        vm.scramble.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('scrambles.view', {
          scrambleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
