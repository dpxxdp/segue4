(function () {
  'use strict';

  describe('Bugs Route Tests', function () {
    // Initialize global variables
    var $scope,
      BugsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BugsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BugsService = _BugsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bugs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bugs');
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
          BugsController,
          mockBug;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bugs.view');
          $templateCache.put('modules/bugs/client/views/view-bug.client.view.html', '');

          // create mock Bug
          mockBug = new BugsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bug Name'
          });

          //Initialize Controller
          BugsController = $controller('BugsController as vm', {
            $scope: $scope,
            bugResolve: mockBug
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:bugId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.bugResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            bugId: 1
          })).toEqual('/bugs/1');
        }));

        it('should attach an Bug to the controller scope', function () {
          expect($scope.vm.bug._id).toBe(mockBug._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bugs/client/views/view-bug.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BugsController,
          mockBug;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bugs.create');
          $templateCache.put('modules/bugs/client/views/form-bug.client.view.html', '');

          // create mock Bug
          mockBug = new BugsService();

          //Initialize Controller
          BugsController = $controller('BugsController as vm', {
            $scope: $scope,
            bugResolve: mockBug
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.bugResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bugs/create');
        }));

        it('should attach an Bug to the controller scope', function () {
          expect($scope.vm.bug._id).toBe(mockBug._id);
          expect($scope.vm.bug._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bugs/client/views/form-bug.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BugsController,
          mockBug;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bugs.edit');
          $templateCache.put('modules/bugs/client/views/form-bug.client.view.html', '');

          // create mock Bug
          mockBug = new BugsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Bug Name'
          });

          //Initialize Controller
          BugsController = $controller('BugsController as vm', {
            $scope: $scope,
            bugResolve: mockBug
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:bugId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.bugResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            bugId: 1
          })).toEqual('/bugs/1/edit');
        }));

        it('should attach an Bug to the controller scope', function () {
          expect($scope.vm.bug._id).toBe(mockBug._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bugs/client/views/form-bug.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
