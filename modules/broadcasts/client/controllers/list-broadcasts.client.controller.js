(function () {
  'use strict';

  angular
    .module('broadcasts')
    .controller('BroadcastsListController', BroadcastsListController);

  BroadcastsListController.$inject = ['BroadcastsService'];

  function BroadcastsListController(BroadcastsService) {
    var vm = this;

    vm.broadcasts = BroadcastsService.query();
  }
})();
