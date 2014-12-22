'use strict';
// Setting up route
angular.module('repository').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/repository/views/';
        $stateProvider.
            state('repository', {
                url: '/repository',
                controller: 'repositoryController',
                templateUrl: __templates + 'repository.html'
            })
        ;
    }
]);
