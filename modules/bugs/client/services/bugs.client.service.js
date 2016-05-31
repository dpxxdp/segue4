//Bugs service used to communicate Bugs REST endpoints
(function () {
  'use strict';

  angular
    .module('bugs')
    .factory('BugsService', BugsService);

  BugsService.$inject = ['$resource'];

  function BugsService($resource) {
    return $resource('api/bugs/:bugId', {
      bugId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
