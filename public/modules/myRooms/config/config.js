'use strict';

// Configuring the Articles module
angular.module('myRooms').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '我的班级', 'myrooms','item','/myrooms','myRoomsView', false, ['teacher','admin', 'root'], 2);
        //Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
        //Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
    }
]);
