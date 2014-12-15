'use strict';


// Setting up route
angular.module('schoolManage').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        var __templates = '/modules/school/views/';
        $urlRouterProvider.when("/school", "/school/info");


        $stateProvider.
            state('schoolNav', {
                url: '/school',
                controller: 'schoolNavController',
                templateUrl:  __templates + 'schoolNav.html'
            }).
            state('schoolInfo',{
                url: '/info',
                parent: 'schoolNav',
                controller: 'schoolController',
                templateUrl: __templates + 'school.html',
                resolve: {
                    school: ['SchoolDataProvider','AuthService',
                        function(SchoolDataProvider, AuthService) {
                            return SchoolDataProvider.getSchool(AuthService.me.school);
                        }
                    ]
                }
            }).
            state('students',{
                url: '/students',
                parent: 'schoolNav',
                controller: 'studentsController',
                templateUrl: __templates + 'students.html',
                resolve: {
                    students: ['StudentDataProvider','AuthService',
                        function(StudentDataProvider, AuthService) {
                            return StudentDataProvider.getStudentsBySchool(AuthService.me.school);
                        }
                    ]

                }
            }).
            state('teachers',{
                url: '/teachers',
                parent: 'schoolNav',
                controller: 'teachersController',
                templateUrl: __templates + 'teachers.html',
                resolve: {
                    teachers: ['TeacherDataProvider','AuthService',
                        function(TeacherDataProvider, AuthService) {
                            return TeacherDataProvider.getTeachersBySchool(AuthService.me.school);
                        }
                    ]

                }
            }).
            state('classes',{
                url: '/classes',
                parent: 'schoolNav',
                controller: 'classesController',
                templateUrl: __templates + 'classes.html',
                resolve: {
                    rooms: ['RoomDataProvider','AuthService',
                        function(RoomDataProvider, AuthService) {
                            return RoomDataProvider.getAdminRoomsBySchool(AuthService.me.school);
                        }
                    ]

                }
            }).
            state('tablets',{
                url: '/tablets',
                parent: 'schoolNav',
                controller: 'tabletsController',
                templateUrl: __templates + 'tablets.html',
                resolve: {
                    tablets: ['TabletDataProvider','AuthService',
                        function(TabletDataProvider, AuthService) {
                            return TabletDataProvider.getTabletsBySchool(AuthService.me.school);
                        }
                    ]

                }
            }).
            state('apps',{
                url: '/apps',
                parent: 'schoolNav',
                controller: 'appsController',
                templateUrl: __templates + 'apps.html',
                resolve: {
                    apps: ['AppDataProvider', 'AuthService',
                    function(AppDataProvider, AuthService) {
                        return AppDataProvider.getAppsBySchool(AuthService.me.school);
                    }]
                }
            }).
            state('template',{
                url: '/template',
                parent: 'schoolNav',
                controller: 'templateController',
                templateUrl: __templates + 'template.html'
            }).
            state('setting', {
                url: '/setting',
                parent: 'schoolNav',
                controller: 'settingController',
                templateUrl: __templates + 'setting.html',
                resolve: {
                    school: ['SchoolDataProvider','AuthService',
                        function(SchoolDataProvider, AuthService) {
                            return SchoolDataProvider.getSchool(AuthService.me.school);
                        }
                    ]
                }
            })
        ;
    }
]);

