(function () {
  'use strict';

  angular
    .module('pieces')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pieces', {
        abstract: true,
        url: '/pieces',
        template: '<ui-view/>'
      })
      .state('pieces.list', {
        url: '',
        templateUrl: 'modules/pieces/client/views/list-pieces.client.view.html',
        controller: 'PiecesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pieces List'
        }
      })
      .state('pieces.create', {
        url: '/create',
        templateUrl: 'modules/pieces/client/views/form-piece.client.view.html',
        controller: 'PiecesController',
        controllerAs: 'vm',
        resolve: {
          pieceResolve: newPiece
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Pieces Create'
        }
      })
      .state('pieces.edit', {
        url: '/:pieceId/edit',
        templateUrl: 'modules/pieces/client/views/form-piece.client.view.html',
        controller: 'PiecesController',
        controllerAs: 'vm',
        resolve: {
          pieceResolve: getPiece
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Piece {{ pieceResolve.name }}'
        }
      })
      .state('pieces.view', {
        url: '/:pieceId',
        templateUrl: 'modules/pieces/client/views/view-piece.client.view.html',
        controller: 'PiecesController',
        controllerAs: 'vm',
        resolve: {
          pieceResolve: getPiece
        },
        data:{
          pageTitle: 'Piece {{ articleResolve.name }}'
        }
      });
  }

  getPiece.$inject = ['$stateParams', 'PiecesService'];

  function getPiece($stateParams, PiecesService) {
    return PiecesService.get({
      pieceId: $stateParams.pieceId
    }).$promise;
  }

  newPiece.$inject = ['PiecesService'];

  function newPiece(PiecesService) {
    return new PiecesService();
  }
})();
