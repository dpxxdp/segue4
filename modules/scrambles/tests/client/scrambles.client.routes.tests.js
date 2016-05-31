(function () {
  'use strict';

  describe('Scrambles Route Tests', function () {
    // Initialize global variables
    var $scope,
      ScramblesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ScramblesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ScramblesService = _ScramblesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('scrambles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/scrambles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ScramblesController,
          mockScramble;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('scrambles.view');
          $templateCache.put('modules/scrambles/client/views/view-scramble.client.view.html', '');

          // create mock Scramble
          mockScramble = new ScramblesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Scramble Name'
          });

          //Initialize Controller
          ScramblesController = $controller('ScramblesController as vm', {
            $scope: $scope,
            scrambleResolve: mockScramble
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:scrambleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.scrambleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            scrambleId: 1
          })).toEqual('/scrambles/1');
        }));

        it('should attach an Scramble to the controller scope', function () {
          expect($scope.vm.scramble._id).toBe(mockScramble._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/scrambles/client/views/view-scramble.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ScramblesController,
          mockScramble;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('scrambles.create');
          $templateCache.put('modules/scrambles/client/views/form-scramble.client.view.html', '');

          // create mock Scramble
          mockScramble = new ScramblesService();

          //Initialize Controller
          ScramblesController = $controller('ScramblesController as vm', {
            $scope: $scope,
            scrambleResolve: mockScramble
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.scrambleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/scrambles/create');
        }));

        it('should attach an Scramble to the controller scope', function () {
          expect($scope.vm.scramble._id).toBe(mockScramble._id);
          expect($scope.vm.scramble._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/scrambles/client/views/form-scramble.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ScramblesController,
          mockScramble;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('scrambles.edit');
          $templateCache.put('modules/scrambles/client/views/form-scramble.client.view.html', '');

          // create mock Scramble
          mockScramble = new ScramblesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Scramble Name'
          });

          //Initialize Controller
          ScramblesController = $controller('ScramblesController as vm', {
            $scope: $scope,
            scrambleResolve: mockScramble
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:scrambleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.scrambleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            scrambleId: 1
          })).toEqual('/scrambles/1/edit');
        }));

        it('should attach an Scramble to the controller scope', function () {
          expect($scope.vm.scramble._id).toBe(mockScramble._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/scrambles/client/views/form-scramble.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
