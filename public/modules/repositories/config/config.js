'use strict';

// Configuring the Articles module
angular.module('repositories').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '所有教学资源', 'repositories','item','/repositories','repositories', false, ['root'], 7);
    }
]);
