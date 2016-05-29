(function () {
  'use strict';

  angular
    .module('pieces')
    .controller('PiecesListController', PiecesListController);

  PiecesListController.$inject = ['PiecesService'];

  function PiecesListController(PiecesService) {
    var vm = this;

    vm.pieces = PiecesService.query();
  }
})();
