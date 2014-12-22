'use strict';

// Configuring the Articles module
angular.module('repository').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '资源库', 'repository','item','/repository','repository', false, ['root'], 6);
    }
]);
