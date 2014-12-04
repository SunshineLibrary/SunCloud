angular.module('resources')
    .controller('appViewController',
    ['theApp', 'myRooms','AppDataProvider', 'RoomDataProvider', '$scope', '$stateParams', 'FileUploader', 'AuthService', '$q',
        function (theApp, myRooms,AppDataProvider, RoomDataProvider,$scope, $stateParams, FileUploader, AuthService, $q) {
            $scope.app = theApp;
            //$scope.rooms = $scope.app.rooms;
            var me = AuthService.me;
            $scope.roles = AuthService.me.roles;
            $scope.myRooms = myRooms;
            $scope.rooms = [];
            $scope.error = {};
            $scope.editorEnabled = false;
            $scope.editor2Enabled = false;
            $scope.selectedRooms = [];
            $scope.selected = [];
            $scope.pushOptions = [{value: false, name: '需要手动分配给班级'},{value: true, name: '默认分配给所有班级'}];

            $scope.$watch('app', function(newApp) {
                if(newApp) {
                    $scope.app = newApp;
                }
            },true);

            $scope.$watch('rooms', function (newRooms) {
                if (newRooms) {
                    $scope.rooms = newRooms;
                }
            }, true);

            $scope.enableEditor = function() {
                $scope.editorEnabled = true;
                $scope.editablename = $scope.app.name;
            };
            $scope.disableEditor = function() {
                $scope.editorEnabled = false;
            };
            $scope.enableEditor2 = function() {
                $scope.editor2Enabled = true;
                $scope.editablename = $scope.app.name;
            };
            $scope.disableEditor2 = function() {
                $scope.editor2Enabled = false;
            };

            var hasTheApp = function(roomId) {
                var deferred = $q.defer();
                RoomDataProvider.getRoom(roomId).then(function(room) {
                     deferred.resolve(room.apps.indexOf(theApp._id) > -1);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
            var myRoomPromises = [];

            _.each($scope.myRooms, function(myRoom) {
                var myRoomPromise = hasTheApp(myRoom._id);
                myRoomPromises.push(myRoomPromise);
            });

            $q.all(myRoomPromises).then(function(data) {
                $scope.myRoomsAssigned = _.filter($scope.myRooms, function(myRoom, i) {
                    return data[i];
                });
                _.each($scope.myRooms, function(myRoom,i) {
                    myRoom.assigned = data[i];
                })
            });

            $scope.toAssignApp = function() {
                //$scope.selected = _.map($scope.myRooms, function(myRoom) {
                //    return myRoom.assigned;
                //});
                _.each($scope.myRooms, function(myRoom, i) {
                    $scope.selected[i] = myRoom.assigned;
                });
                console.log($scope.selected);
                $('#assignAppDialog').modal('show');
            };


            $scope.checkAll = function() {
               $scope.selected = _.map($scope.selected, function(item) {
                   return true;
               });
            };
            $scope.uncheckAll = function() {
                $scope.selected = _.map($scope.selected, function(item) {
                    return false;
                })
            };

            $scope.assignToRooms = function() {
                _.each($scope.myRooms, function(myRoom, i) {
                    myRoom.assigned = $scope.selected[i];
                });
                var assignment = _.map($scope.myRooms, function(myRoom) {
                    return {roomId: myRoom._id, assigned: myRoom.assigned};
                });
                console.log(assignment);
                AppDataProvider.addAppToRooms($scope.app._id, assignment)
                    .success(function(res) {
                        console.log('success response:');
                        console.log(res);
                        $('#assignAppDialog').modal('hide');
                        swal({title:"分配成功", type: "success", timer: 1000});
                        $scope.myRoomsAssigned = _.filter($scope.myRooms, function(myRoom) {
                            return myRoom.assigned;
                        });
                        //$scope.rooms = $scope.rooms.concat(theSelectedRoomsId);
                        //$scope.myRoomsAssigned = _.filter($scope.myRooms, function(room) {
                        //    return theSelectedRoomsId.indexOf(room._id) > -1;
                        //});
                    })
                    .error(function(err){
                        console.log('fail response');
                        console.error(err);
                        swal({title:"分配失败", text: "请重试", type: "error", timer: 2000})
                    })
            };

            $scope.save = function() {
                var newApp = $scope.app;
                newApp.name = $scope.editablename;
                $scope.editorEnabled = false;
                AppDataProvider.updateApp(newApp)
                    .success(function(app){
                        $scope.app.name = app.name;
                    }).error(function(err){
                        console.error(err);
                        swal({title: "修改失败", text: "请重试", type: 'error'})
                    })
            };

            $scope.uploader = new FileUploader({
                url: "/upload/app/" + $stateParams.appId,
                queueLimit: 1,
                removeAfterUpload: true
            });


            $scope.uploader.onSuccessItem = function(item, response, status) {
                $('#uploadApkDialog').modal('hide');
                swal({title: " 上传成功",type: 'success', timer: 2000});
                $scope.uploader.clearQueue();
                $scope.app.apks.push(response);
                $scope.app.package = response.package;
            };

            $scope.uploader.onErrorItem = function(item, response, status) {
                swal({title: " 上传失败", text: response.message,type: 'error'});
                if (status == 406) {
                    $scope.uploader.clearQueue();

                }
            };

            $scope.uploader.filters.push({
                name: 'apkOnly',
                fn: function (item) {
                    $scope.error.extension = false;
                    var fileName = item.name;
                    var extension = fileName.substr(fileName.lastIndexOf('.') + 1);
                    if (extension !== 'apk') {
                        $scope.error.extension = true;
                    }
                    return extension === 'apk';

                }
            });

            $scope.uploader.filters.push({
                name: 'queueLimit',
                fn: function () {
                    $scope.error.limit = false;
                    $scope.error.limit = (this.queue.length > 1);
                    return this.queue.length < 10;
                }
            });

            $scope.gridOptions =
            {
                data: 'app.apks',
                multiSelect: false,
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'id', displayName: 'ID', width: '20%'},
                    {field: 'versionName', displayName: '版本名称', width: '10%'},
                    {field: 'versionCode', displayName: '版本号', width: '10%'},
                    {field: 'package', displayName: '内部包名'},
                    {field: 'fileName', displayName: '安装包', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/download/apks/{{row.entity._id}}">{{row.getProperty(col.field)}}</a></div>'},
                    {field: 'size', displayName: '大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field]/1024/1024 | number:2}} MB</div>'},
                    {field: '', displayName: '操作', width: '10%',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()">' +
                    '<a class="glyphicon glyphicon-remove text-primary" role="button" ng-click="deleteApk(row)"></a></div>'}
                ]
            };


            $scope.deleteApk = function (row) {
                swal({
                        title: "您确定要删除此安装包吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        AppDataProvider.deleteApk($scope.app, row.entity._id)
                            .success(function(app){
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.app = app;
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "删除失败", text: "请重试", type: 'error', timer: 1500})
                            })
                    });
            }
        }
    ]
).filter('existFilter', function(input) {
        return input.length? input: '暂无'
    });



//function getMyRooms() {
//    var defered = $q.defer();
//    if(me.roles.indexOf('teacher') > -1 && me.roles.indexOf('admin') > -1  ) {
//        RoomDataProvider.getRoomsByTeacher(me._id)
//            .then(function(rooms) {
//                $scope.myRooms = rooms;
//                return  RoomDataProvider.getAdminRoomsBySchool(me.school);
//            }).then(function(rooms) {
//                $scope.myRooms = _.filter($scope.myRooms, function(room) {
//                    return room.type = 'teaching';
//                });
//                $scope.myRooms = $scope.myRooms.concat(rooms);
//                $scope.myRooms = _.uniq($scope.myRooms, function(room) {return room._id});
//                defered.resolve($scope.myRooms);
//            });
//    }else if(me.roles.indexOf('teacher') > -1){
//        RoomDataProvider.getRoomsByTeacher(me._id).then(function(rooms) {
//            $scope.myRooms = rooms;
//            defered.resolve($scope.myRooms);
//        });
//    }else {
//        RoomDataProvider.getAdminRoomsBySchool(me.school).then(function(rooms) {
//            $scope.myRooms = rooms;
//            defered.resolve($scope.myRooms);
//        })
//    }
//    return defered.promise;
//}
