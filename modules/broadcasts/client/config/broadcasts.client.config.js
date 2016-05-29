(function () {
  'use strict';

  angular
    .module('broadcasts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Broadcasts',
      state: 'broadcasts',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'broadcasts', {
      title: 'List Broadcasts',
      state: 'broadcasts.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'broadcasts', {
      title: 'Create Broadcast',
      state: 'broadcasts.create',
      roles: ['user']
    });
  }
})();
