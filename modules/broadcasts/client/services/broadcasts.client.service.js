//Broadcasts service used to communicate Broadcasts REST endpoints
(function () {
  'use strict';

  angular
    .module('broadcasts')
    .factory('BroadcastsService', BroadcastsService);

  BroadcastsService.$inject = ['$resource'];

  function BroadcastsService($resource) {
    return $resource('api/broadcasts/:broadcastId', {
      broadcastId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
