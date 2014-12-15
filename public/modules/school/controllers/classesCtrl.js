angular.module('schoolManage')
    .controller('classesController',
    ['rooms', 'RoomDataProvider', '$scope', 'AuthService', '$location',
        function (rooms, RoomDataProvider, $scope, AuthService, $location) {
            $scope.rooms = rooms;
            var me = AuthService.me;
            $scope.selectedRoom = [];
            $scope.temp = {};
            $scope.room = {};
            $scope.filterOptions = {filterText: ''};
            $scope.editErrorMessage = '';

            $scope.gridOptions =
            {
                data: 'rooms',
                multiSelect: false,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '班级名'},
                    {field: 'code', displayName: '班级编号', cellTemplate: '<div ng-show="row.entity.code">{{row.entity.code}}</div><div ng-hide="row.entity.code"><span class="label label-default">暂无</span></div>'},
                    {field:'students.length', displayName: '学生数'},
                    {field: 'teachers.length', displayName: '老师数'},
                    {field: '', displayName: '编辑', cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="fui-new text-success" ng-click="showEditRoomDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="fui-cross text-danger" ng-click="deleteRoom($event, row)"></a></div>'}

                    //{field: 'school.name', displayName: '管理老师'},
                    //{field: 'grade', displayName: '年级', width: 50}
                    //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
                ],
                selectedItems: $scope.selectedRoom,
                filterOptions: $scope.filterOptions
            };

            $scope.createAdminRoom = function() {
                $scope.temp.createRoomTip = '';
                if (($scope.newRoomName == "") || ($scope.newRoomName === undefined)) {
                    $scope.temp.createRoomTip = 'noName';
                    return;
                }
                if ($scope.newRoomName.length > 15) {
                    $scope.temp.createRoomTip = 'formatWrong';
                    return;
                }
                //var rooms = $scope.rooms;
                //for (var roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
                //    if (rooms[roomIndex].name == $scope.newRoomName.trim()) {
                //        $scope.temp.createRoomTip = 'alreadyHave';
                //        return;
                //    }
                //}
                var info = {};
                info.name = $scope.newRoomName.trim();
                info.school = me.school;
                RoomDataProvider.createAdminRoom(info)
                    .success(function(newRoom) {
                        $scope.rooms.push(newRoom);
                        $scope.newRoomName = undefined;
                        $('#createRoomDialog').modal('hide');
                        swal({title: "创建班级成功", type: "success", timer: 1000 });
                    })
                    .error(function(err){
                        console.log(err);
                        var message = err.errors.name.message || "创建失败，请重试";
                        swal({title: "创建失败", text: message, type: "error", timer: 2000 });
                    });
            };

            $scope.deleteRoom = function (event, row) {
                event.stopPropagation();
                swal({
                        title: "您确定要删除"+row.entity.name+"吗?",
                        text: "删除之后，该班级信息将无法找回",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        RoomDataProvider.deleteRoom(row.entity._id)
                            .success(function(room){
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.rooms.splice($scope.rooms.indexOf(row.entity),1);
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "删除失败", text: "", type: 'error'})
                            })
                    });
            };


            $scope.showEditRoomDialog = function(event, row) {
                event.stopPropagation();
                $('#editRoomDialog').modal('show');
                $scope.row = row;
                $scope.room.newName = row.entity.name;
                $scope.room.newCode = row.entity.code;
            };
            $scope.editRoom = function(row) {
                var info = {};
                info._id = row.entity._id;
                info.name = $scope.room.newName;
                info.code = $scope.room.newCode;

                //var rooms = $scope.rooms;
                //for (var roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
                //    if(roomIndex !== rooms.indexOf(row.entity)) {
                //        if (rooms[roomIndex].name === $scope.room.newName.trim()) {
                //            $scope.room.nameError = true;
                //            return;
                //        }
                //        if($scope.room.newCode) {
                //            if (rooms[roomIndex].code === $scope.room.newCode.trim()) {
                //                $scope.room.codeError = true;
                //                return;
                //            }
                //        }
                //    }
                //}

                RoomDataProvider.editRoomNameAndCode(info)
                    .success(function(editedRoom) {
                        $scope.row.entity.name = editedRoom.name;
                        $scope.row.entity.code = editedRoom.code;
                        $('#editRoomDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                        $scope.room.codeError = false;
                        $scope.room.codeError = false;
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试~~~~~", type: "error", timer: 2000 });
                    })
            };

            $scope.selectRoom = function () {
                $location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
            };
        }]);
