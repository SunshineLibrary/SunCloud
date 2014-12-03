angular.module('resources')
    .controller('studentViewController',
    ['student','StudentDataProvider', '$scope', 'AuthService', 'UserDataProvider','RoomDataProvider', '$location', '$stateParams',
        function (student,StudentDataProvider, $scope, AuthService, UserDataProvider, RoomDataProvider,$location, $stateParams) {
            $scope.student = student;
            $scope.rooms = [];


            RoomDataProvider.getRoomsByStudent($stateParams.studentId).then(function(rooms) {
                _.each(rooms, function(room) {
                    $scope.rooms.push(room.name)
                })
            });

            UserDataProvider.getTablet($stateParams.studentId).then(function(record) {
                if(record.length){
                    $scope.tablet = record[0].tabletId.machine_id;
                }else{
                    $scope.tablet = "暂无"
                }
            });

            UserDataProvider.getTabletHistory($stateParams.studentId).then(function(history) {
                $scope.xiaoshuHistory = history;

            })







        }
    ]
);