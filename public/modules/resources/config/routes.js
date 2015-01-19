'use strict';


// Setting up route
angular.module('resources').config(['$stateProvider',
    function($stateProvider) {
        var __templates = '/modules/resources/views/';

        $stateProvider.
            state('roomView', {
                url: '/rooms/:roomId',
                controller: 'roomViewController',
                templateUrl:  __templates + 'room.html',
                resolve: {
                    room: ['RoomDataProvider','$stateParams', 'AuthService',
                        function(RoomDataProvider, $stateParams) {
                            return RoomDataProvider.getRoomFull($stateParams.roomId);
                        }
                    ]
                }
            }).
            state('studentView',{
                url: '/students/:studentId',
                controller: 'studentViewController',
                templateUrl: __templates + 'student.html',
                resolve: {
                    student: ['StudentDataProvider','$stateParams',
                        function(StudentDataProvider, $stateParams) {
                            return StudentDataProvider.getStudent($stateParams.studentId);
                        }
                    ]
                }
            }).
            state('teacherView',{
                url: '/teachers/:teacherId',
                controller: 'teacherViewController',
                templateUrl: __templates + 'teacher.html',
                resolve: {
                    teacher: ['TeacherDataProvider','$stateParams',
                        function(TeacherDataProvider, $stateParams) {
                            return TeacherDataProvider.getTeacher($stateParams.teacherId);
                        }
                    ]
                }
            }).
            state('tabletView',{
                url: '/tablets/:tabletId',
                controller: 'tabletViewController',
                templateUrl: __templates + 'tablet.html',
                resolve: {
                    theTablet: ['TabletDataProvider', '$stateParams',
                        function(TabletDataProvider, $stateParams) {
                            return TabletDataProvider.getTablet($stateParams.tabletId)
                        }
                    ]
                }
            }).
            state('appView',{
                url: '/apps/:appId',
                controller: 'appViewController',
                templateUrl: __templates + 'app.html',
                resolve: {
                    theApp: ['AppDataProvider', '$stateParams',
                        function(AppDataProvider, $stateParams) {
                            return AppDataProvider.getApp($stateParams.appId)
                        }
                    ],
                    myRooms: ['RoomDataProvider', 'AuthService',
                        function(RoomDataProvider, AuthService) {
                            return RoomDataProvider.getMyRooms(AuthService.me)
                        }
                    ]
                }
            }).
            state('schoolView',{
                url: '/schools/:schoolId',
                controller: 'schoolViewController',
                templateUrl: __templates + 'school.html',
                resolve: {
                    school: ['SchoolDataProvider', '$stateParams',
                        function(SchoolDataProvider, $stateParams) {
                            return SchoolDataProvider.getSchool($stateParams.schoolId)
                        }
                    ],
                    schoolRooms: ['RoomDataProvider', '$stateParams',
                        function(RoomDataProvider, $stateParams) {
                            return RoomDataProvider.getRoomsBySchool($stateParams.schoolId)
                        }
                    ],
                    admins:['TeacherDataProvider', '$stateParams',
                        function(TeacherDataProvider, $stateParams) {
                            return TeacherDataProvider.getAdminsBySchool($stateParams.schoolId)
                        }]
                }
            })
        ;
    }
]);