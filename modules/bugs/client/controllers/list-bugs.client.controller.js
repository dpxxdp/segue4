(function () {
  'use strict';

  angular
    .module('bugs')
    .controller('BugsListController', BugsListController);

  BugsListController.$inject = ['BugsService'];

  function BugsListController(BugsService) {
    var vm = this;

    vm.bugs = BugsService.query();
  }
})();
