(function () {
  'use strict';

  // Pieces controller
  angular
    .module('pieces')
    .controller('PiecesController', PiecesController);

  PiecesController.$inject = ['$scope', '$state', '$timeout', '$window', 'Authentication', 'pieceResolve', 'FileUploader'];

  function PiecesController($scope, $state, $timeout, $window, Authentication, piece, FileUploader) {
    var vm = this;
    $scope.imageURL = '';

    $scope.uploader = new FileUploader({
      url: 'api/pieces',
      alias: 'newPiece'
    });

    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      $scope.success = true;
      $scope.cancelUpload();
      $state.go('pieces.view', {
        pieceId: response._id
      });
    };

    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      $scope.cancelUpload();
      vm.error = res.data.message;
    };

    $scope.uploadProfilePicture = function () {
      $scope.success = $scope.error = null;
      $scope.uploader.uploadAll();
    };

    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = '';
    };

    vm.authentication = Authentication;
    vm.piece = piece;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addPieceTitle = false;
    
    $scope.togglePieceTitle = function() {
        if(vm.addPieceTitle) {
          vm.piece.name = '';
        }
        vm.addPieceTitle = !vm.addPieceTitle;
    }

    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.piece.$remove($state.go('pieces.list'));
      }
    }

    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pieceForm');
        return false;
      }

      if (vm.piece._id) {
        vm.piece.$update(successCallback, errorCallback);
      } else {
        vm.piece.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pieces.view', {
          pieceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
