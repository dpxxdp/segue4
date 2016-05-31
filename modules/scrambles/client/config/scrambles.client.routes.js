(function () {
  'use strict';

  angular
    .module('scrambles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('scrambles', {
        abstract: true,
        url: '/scrambles',
        template: '<ui-view/>'
      })
      .state('scrambles.list', {
        url: '',
        templateUrl: 'modules/scrambles/client/views/list-scrambles.client.view.html',
        controller: 'ScramblesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Scrambles List'
        }
      })
      .state('scrambles.create', {
        url: '/create',
        templateUrl: 'modules/scrambles/client/views/form-scramble.client.view.html',
        controller: 'ScramblesController',
        controllerAs: 'vm',
        resolve: {
          scrambleResolve: newScramble
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Scrambles Create'
        }
      })
      .state('scrambles.edit', {
        url: '/:scrambleId/edit',
        templateUrl: 'modules/scrambles/client/views/form-scramble.client.view.html',
        controller: 'ScramblesController',
        controllerAs: 'vm',
        resolve: {
          scrambleResolve: getScramble
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Scramble {{ scrambleResolve.name }}'
        }
      })
      .state('scrambles.view', {
        url: '/:scrambleId',
        templateUrl: 'modules/scrambles/client/views/view-scramble.client.view.html',
        controller: 'ScramblesController',
        controllerAs: 'vm',
        resolve: {
          scrambleResolve: getScramble
        },
        data:{
          pageTitle: 'Scramble {{ articleResolve.name }}'
        }
      });
  }

  getScramble.$inject = ['$stateParams', 'ScramblesService'];

  function getScramble($stateParams, ScramblesService) {
    return ScramblesService.get({
      scrambleId: $stateParams.scrambleId
    }).$promise;
  }

  newScramble.$inject = ['ScramblesService'];

  function newScramble(ScramblesService) {
    return new ScramblesService();
  }
})();
