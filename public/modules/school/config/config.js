'use strict';

// Configuring the Articles module
angular.module('schoolManage').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', '学校管理', 'school','item','/school','schoolNav',false,['admin', 'root'],1);
    }
]).run(function(amMoment) {
    amMoment.changeLocale('zh-cn');
})
    .constant('angularMomentConfig', {
        timezone: 'Beijing' // e.g. 'Europe/London'
    });;
