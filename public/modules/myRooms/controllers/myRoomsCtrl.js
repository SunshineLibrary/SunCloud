angular.module('myRooms')
    .controller('myRoomsController', [
        'myRooms',
        '$scope',
        'RoomDataProvider',
        'DataAgent',
        'UserDataProvider',
        '$location',
        'AuthService',
        '$state',
        '$stateParams',
        function(myRooms, $scope, RoomDataProvider, DataAgent, UserDataProvider, $location, AuthService, $state, $stateParams) {
            $scope.rooms = myRooms;
            var me = AuthService.me;
            $scope.temp = {};
            console.log($state.current);
            console.log($state.params.roomId);
            console.log($stateParams.roomId);


            $scope.$watch('rooms', function(newRooms) {
                RoomDataProvider.getAdminRoomsBySchool(me.school).then(function(rooms){
                    $scope.roomList = _.filter(rooms, function(room) {
                        return !_.find($scope.rooms, function(myRoom) {
                            return myRoom._id === room._id;
                        })
                    });
                    $scope.selectedRoom = $scope.roomList[0];
                });
                if (newRooms) {
                    $scope.rooms = newRooms;
                    for (var index = 0; index < $scope.rooms.length; index++) {
                        var theRoom = $scope.rooms[index];
                        if (theRoom.students === undefined) {
                            theRoom.students = [];
                        }
                    }
                }
            }, true);

            $scope.$on('roomNameChange', function(event, data) {
                console.log(data);
                var theRoom = _.find($scope.rooms, function(room) {
                    return room._id === data.id;
                });
                theRoom.name = data.name;
            });
            $scope.$on('removeRoom', function(event, data) {
                $scope.rooms = _.filter($scope.rooms, function(room) {
                    return room._id !== data.id;
                });
                $location.path('/myrooms/' + $scope.rooms[0]._id);
            });
            $scope.$on('changeStudents', function(event, data) {
                var theRoom = _.find($scope.rooms, function(room) {
                    return room._id === data.id;
                });
                theRoom.students.length = data.studentsNum;
            });

            $scope.selectOneRoom = function(selectedRoom) {
                //_.each($scope.rooms, function(item) {
                //    item.isActive = selectedRoom._id === item._id ;
                //});
              $location.path('/myrooms/' + selectedRoom._id);
            };

            $scope.createTeachingRoom = function() {
                $scope.temp.createRoomTip = '';
                if (($scope.newRoomName == "") || ($scope.newRoomName === undefined)) {
                    $scope.temp.createRoomTip = 'noName';
                    return;
                }
                if ($scope.newRoomName.length > 15) {
                    $scope.temp.createRoomTip = 'formatWrong';
                    return;
                }
                var rooms = $scope.rooms;
                for (var roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
                    if (rooms[roomIndex].name == $scope.newRoomName.trim()) {
                        $scope.temp.createRoomTip = 'alreadyHave';
                        return;
                    }
                }
                var info = {};
                info.name = $scope.newRoomName.trim();
                info.school = me.school;
                info.me = me._id;
                RoomDataProvider.createTeachingRoom(info).success(function(newRoom) {
                    $scope.rooms.push(newRoom);
                    $scope.newRoomName = '';
                    $('#createRoomDialog').modal('hide');
                    swal({title: "创建成功", type: "success", timer: 1500});
                    $location.path('/myrooms/' + newRoom._id);
                }).error(function(err){
                    console.error(err);
                    swal({title: "创建失败", text: "请重试", type: "error", timer: 1500});
                });
            };

            $scope.claimRoom = function() {
                RoomDataProvider.addTeachersToRoom($scope.selectedRoom._id, [me._id])
                    .success(function(newRoom){
                        $scope.rooms.push(newRoom);
                        $('#claimRoomDialog').modal('hide');
                        swal({title: "认领成功", type: "success", timer: 1500});
                        $location.path('/myrooms/' + newRoom._id);
                    })
                    .error(function(err){
                        console.error(err);
                        swal({title: "认领失败", text: "请重试", type: "error", timer: 1500});
                    })
            };

            // Focus state for append/prepend inputs
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.input-group, .form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.input-group, .form-group').removeClass('focus');
            });

        }
    ]);
