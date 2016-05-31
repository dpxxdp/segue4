(function () {
  'use strict';

  angular
    .module('scrambles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Scrambler',
      state: 'scrambles.list',
      roles: ['user', 'admin']
    });
  }
})();
