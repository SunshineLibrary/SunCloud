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
