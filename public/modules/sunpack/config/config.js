'use strict';

// Configuring the Articles module
angular.module('sunpack').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '阳光书包', 'sunpack','item','/sunpack','sunpack',false,['root','admin','teacher'],5);
        // Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
        //Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
    }
]);
