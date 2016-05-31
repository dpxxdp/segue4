//Scrambles service used to communicate Scrambles REST endpoints
(function () {
  'use strict';

  angular
    .module('scrambles')
    .factory('ScramblesService', ScramblesService);

  ScramblesService.$inject = ['$resource'];

  function ScramblesService($resource) {
    return $resource('api/scrambles/:scrambleId', {
      scrambleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
