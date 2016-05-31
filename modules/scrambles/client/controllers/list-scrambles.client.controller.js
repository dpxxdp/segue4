(function () {
  'use strict';

  angular
    .module('scrambles')
    .controller('ScramblesListController', ScramblesListController);

  ScramblesListController.$inject = ['ScramblesService'];

  function ScramblesListController(ScramblesService) {
    var vm = this;

    vm.scrambles = ScramblesService.query();
  }
})();
