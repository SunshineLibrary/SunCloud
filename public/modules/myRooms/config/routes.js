'use strict';
// Setting up route
angular.module('myRooms').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.when("/myrooms", "/myrooms");
        var __templates = '/modules/myRooms/views/';
        $stateProvider.
            state('myRoomsView', {
                url: '/myrooms',
                controller: 'myRoomsController',
                templateUrl: __templates + 'rooms.html',
                resolve: {
                    myRooms: ['RoomDataProvider', 'AuthService',
                        function(RoomDataProvider, AuthService) {
                            return RoomDataProvider.getRoomsByTeacher(AuthService.me._id)
                        }
                    ]
                }
            }).
            state('myRoomView',{
                url: '/:roomId',
                parent: 'myRoomsView',
                controller: 'myRoomController',
                templateUrl: __templates + 'room.html',
                resolve: {
                    theRoom: ['RoomDataProvider','$stateParams',
                        function(RoomDataProvider, $stateParams) {
                            return RoomDataProvider.getRoomFull($stateParams.roomId)
                        }
                    ]
                }
            })
        ;
    }
]);
