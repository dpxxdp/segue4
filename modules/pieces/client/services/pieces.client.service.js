//Pieces service used to communicate Pieces REST endpoints
(function () {
  'use strict';

  angular
    .module('pieces')
    .factory('PiecesService', PiecesService);

  PiecesService.$inject = ['$resource'];

  function PiecesService($resource) {
    return $resource('api/pieces/:pieceId', {
      pieceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
