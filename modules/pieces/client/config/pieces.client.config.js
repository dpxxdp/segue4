(function () {
  'use strict';

  angular
    .module('pieces')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Gallery',
      state: 'pieces.list',
      roles: ['user','admin']
    });

    // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'pieces', {
    //   title: 'List Pieces',
    //   state: 'pieces.list'
    // });

    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'pieces', {
    //   title: 'Create Piece',
    //   state: 'pieces.create',
    //   roles: ['user']
    // });
  }
})();
