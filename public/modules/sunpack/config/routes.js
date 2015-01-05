'use strict';

angular.module('sunpack')
    .config(function($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            //prefixStateName: 'Home',
            template: '<div class="breadcrumb"><ul>' +
            '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
            '<a ng-switch-when="false" href="#{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
            '<span ng-switch-when="true" style="color:#27ae60">{{step.ncyBreadcrumbLabel}}</span>' +
            '</li></ul>' +
            '</div>'
        });
    })
    .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/sunpack/views/';
        //$urlRouterProvider.when("/home", "/sunpack");

        $stateProvider
            .state('sunpack', {
                url: '/sunpack',
                controller: 'allSubjectsController',
                templateUrl:  __templates + 'home.html',
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
                    myRooms: ['RoomDataProvider', 'AuthService',
                        function(RoomDataProvider, AuthService) {
                            return RoomDataProvider.getRoomsByTeacher(AuthService.me._id)
                        }
                    ]
                },
                ncyBreadcrumb: {
                    //label: '{{label}}'
                    label: '阳光书包'
                }
            })
            .state('sunpack.subject', {
                url: '^/subjects/:subjectId',
                controller: 'subjectController',
                templateUrl: __templates + 'subject.html',
                resolve: {
                    subject: ['SubjectDataProvider', '$stateParams',
                        function(SubjectDataProvider, $stateParams) {
                            return SubjectDataProvider.getSubject($stateParams.subjectId);
                        }
                    ]
                },
                ncyBreadcrumb: {
                    label: "{{subject.name}}"
                    //label: "语文"
                }
            })
            .state('sunpack.myroom', {
                url: '/myrooms/:roomId',
                controller: 'myRoomPackController',
                templateUrl: __templates + 'myroom.html',
                resolve: {
                  myRoom: ['RoomDataProvider', '$stateParams',
                  function(RoomDataProvider, $stateParams) {
                      return RoomDataProvider.getRoom($stateParams.roomId);
                  }],
                    folders: ['RoomDataProvider', '$stateParams',
                        function(RoomDataProvider, $stateParams) {
                            return RoomDataProvider.getFoldersByRoom($stateParams.roomId);
                        }]
                },
                ncyBreadcrumb: {
                    label: "{{myRoom.name}}"
                }
            })
            .state('sunpack.repo', {
                url: '/repo/:subjectId',
                controller: 'repoController',
                templateUrl: __templates + 'repo.html',
                ncyBreadcrumb: {
                    label: "资源库"
                }
            })
            .state('sunpack.subject.folder', {
                url: '/:folderId',
                controller: 'folderController',
                templateUrl: __templates + 'folder.html',
                resolve: {
                    folder: ['FolderDataProvider', '$stateParams',
                        function(FolderDataProvider, $stateParams) {
                            return FolderDataProvider.getFolder($stateParams.folderId);
                        }
                    ]
                },
                ncyBreadcrumb: {
                    label: '{{folder.name}}'
                    //parent: 'sunpack.subject'
                }
            })
            .state('sunpack.subject.folder.file', {
                url: '/:fileId',
                controller: 'fileController',
                templateUrl: __templates + 'file.html',
                resolve: {
                    file: ['FileDataProvider', '$stateParams',
                        function(FileDataProvider, $stateParams) {
                            return FileDataProvider.getFile($stateParams.fileId);
                        }
                    ]
                },
                ncyBreadcrumb: {
                    label: '{{file.originalname}}'
                    //parent: 'sunpack.subject'
                }
            })
        ;
    }
]);