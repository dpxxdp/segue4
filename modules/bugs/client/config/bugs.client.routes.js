(function () {
  'use strict';

  angular
    .module('bugs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bugs', {
        abstract: true,
        url: '/bugs',
        template: '<ui-view/>'
      })
      .state('bugs.list', {
        url: '',
        templateUrl: 'modules/bugs/client/views/list-bugs.client.view.html',
        controller: 'BugsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bugs List'
        }
      })
      .state('bugs.create', {
        url: '/create',
        templateUrl: 'modules/bugs/client/views/form-bug.client.view.html',
        controller: 'BugsController',
        controllerAs: 'vm',
        resolve: {
          bugResolve: newBug
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bugs Create'
        }
      })
      .state('bugs.edit', {
        url: '/:bugId/edit',
        templateUrl: 'modules/bugs/client/views/form-bug.client.view.html',
        controller: 'BugsController',
        controllerAs: 'vm',
        resolve: {
          bugResolve: getBug
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bug {{ bugResolve.name }}'
        }
      })
      .state('bugs.view', {
        url: '/:bugId',
        templateUrl: 'modules/bugs/client/views/view-bug.client.view.html',
        controller: 'BugsController',
        controllerAs: 'vm',
        resolve: {
          bugResolve: getBug
        },
        data:{
          pageTitle: 'Bug {{ articleResolve.name }}'
        }
      });
  }

  getBug.$inject = ['$stateParams', 'BugsService'];

  function getBug($stateParams, BugsService) {
    return BugsService.get({
      bugId: $stateParams.bugId
    }).$promise;
  }

  newBug.$inject = ['BugsService'];

  function newBug(BugsService) {
    return new BugsService();
  }
})();
