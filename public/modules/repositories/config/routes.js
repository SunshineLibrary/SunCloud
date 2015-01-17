'use strict';
// Setting up route
angular.module('repositories').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/repositories/views/';
        $stateProvider.
            state('repositories', {
                url: '/repositories',
                controller: 'repositoriesController',
                templateUrl: __templates + 'repositories.html',
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
                    schools: ['RootDataProvider',
                        function(RootDataProvider) {
                            return RootDataProvider.getAllSchools();
                        }
                    ],
                    teachers: ['RootDataProvider',
                        function(RootDataProvider) {
                            return RootDataProvider.getAllTeachersMin();
                        }
                    ],
                    folders: ['FolderDataProvider', function(FolderDataProvider) {
                        return FolderDataProvider.getAllFolders();
                    }],
                    files: ['FileDataProvider', function(FileDataProvider) {
                        return FileDataProvider.getAllFiles();
                    }]
                }
            })
        ;
    }
]);
