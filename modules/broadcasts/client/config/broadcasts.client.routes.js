(function () {
  'use strict';

  angular
    .module('broadcasts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('broadcasts', {
        abstract: true,
        url: '/broadcasts',
        template: '<ui-view/>'
      })
      .state('broadcasts.list', {
        url: '',
        templateUrl: 'modules/broadcasts/client/views/list-broadcasts.client.view.html',
        controller: 'BroadcastsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Broadcasts List'
        }
      })
      .state('broadcasts.create', {
        url: '/create',
        templateUrl: 'modules/broadcasts/client/views/form-broadcast.client.view.html',
        controller: 'BroadcastsController',
        controllerAs: 'vm',
        resolve: {
          broadcastResolve: newBroadcast
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Broadcasts Create'
        }
      })
      .state('broadcasts.edit', {
        url: '/:broadcastId/edit',
        templateUrl: 'modules/broadcasts/client/views/form-broadcast.client.view.html',
        controller: 'BroadcastsController',
        controllerAs: 'vm',
        resolve: {
          broadcastResolve: getBroadcast
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Broadcast {{ broadcastResolve.name }}'
        }
      })
      .state('broadcasts.view', {
        url: '/:broadcastId',
        templateUrl: 'modules/broadcasts/client/views/view-broadcast.client.view.html',
        controller: 'BroadcastsController',
        controllerAs: 'vm',
        resolve: {
          broadcastResolve: getBroadcast
        },
        data:{
          pageTitle: 'Broadcast {{ articleResolve.name }}'
        }
      });
  }

  getBroadcast.$inject = ['$stateParams', 'BroadcastsService'];

  function getBroadcast($stateParams, BroadcastsService) {
    return BroadcastsService.get({
      broadcastId: $stateParams.broadcastId
    }).$promise;
  }

  newBroadcast.$inject = ['BroadcastsService'];

  function newBroadcast(BroadcastsService) {
    return new BroadcastsService();
  }
})();
