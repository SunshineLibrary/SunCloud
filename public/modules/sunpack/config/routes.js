'use strict';

angular.module('sunpack')
    //.config(function($breadcrumbProvider) {
    //    $breadcrumbProvider.setOptions({
    //        prefixStateName: 'Home',
    //        template: 'bootstrap3'
    //    });
    //})
    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/sunpack/views/';
        //$urlRouterProvider.when("/home", "/sunpack");

        $stateProvider
            //state('sunpack', {
            //    url: '/spus',
            //    templateUrl:  __templates + 'index.html'
            //})
            .state('sunpack', {
                url: '/subpack',
                controller: 'allSubjectsController',
                templateUrl:  __templates + 'home.html',
                resolve: {
                    subjects: ['SubjectDataProvider',
                        function(SubjectDataProvider) {
                            return SubjectDataProvider.getAllSubjects();
                        }
                    ]
                },
                ncyBreadcrumb: {
                    label: '所有科目'
                }
            })
            .state('subject', {
                url: '/subject',
                controller: '',
                templateUrl: __templates + 'subject.html',
                ncyBreadcrumb: {
                    label: '{{}}'
                }
            })
        ;
    }
]);

