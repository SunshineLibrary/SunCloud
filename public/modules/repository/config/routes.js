'use strict';
// Setting up route
angular.module('repository').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/repository/views/';
        $stateProvider.
            state('repository', {
                url: '/repository',
                controller: 'repositoryController',
                templateUrl: __templates + 'repository.html',
                resolve: {
                    subjects: ['SubjectDataProvider',
                        function(SubjectDataProvider) {
                            return SubjectDataProvider.getAllSubjects();
                        }
                    ],
                    semesters: ['SemesterDataProvider',
                        function(SemesterDataProvider) {
                            return SemesterDataProvider.getAllSemesters();
                        }
                    ],
                    files: ['FileDataProvider', 'AuthService',
                        function(FileDataProvider, AuthService) {
                          return FileDataProvider.getSharedFilesBySchool(AuthService.me.school);
                    }]
                }
            })
        ;
    }
]);
