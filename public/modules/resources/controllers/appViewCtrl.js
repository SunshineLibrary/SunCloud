angular.module('resources')
    .controller('appViewController',
    ['theApp', 'myRooms','AppDataProvider', 'RoomDataProvider', '$scope', '$stateParams', 'FileUploader', 'AuthService', '$q',
        function (theApp, myRooms,AppDataProvider, RoomDataProvider,$scope, $stateParams, FileUploader, AuthService, $q) {
            $scope.app = theApp;
            //$scope.rooms = $scope.app.rooms;
            var me = AuthService.me;
            console.log(me);
            $scope.roles = AuthService.me.roles;
            $scope.myRooms = myRooms;
            console.log($scope.myRooms);
            $scope.rooms = [];
            $scope.error = {};
            $scope.editorEnabled = false;
            $scope.editor2Enabled = false;
            $scope.selectedRooms = [];
            $scope.selected = [];
            $scope.default_installed = $scope.app.default_installed;
            //$scope.pushOptions = [{value: false, name: '需要手动分配给班级'},{value: true, name: '默认分配给所有班级'}];
            console.log('share',$scope.app.shared);
            $scope.isSelf = theApp.owner !== null && theApp.owner !== undefined && (theApp.owner.toString() === me._id.toString());
            $scope.isRootOrAdminOrSelf = me.roles.indexOf('root') > -1 || (me.roles.indexOf('admin') > -1 && theApp.school && me.school.toString() === theApp.school.toString()) || $scope.isSelf;

            $('input[name="pushAppSwitch"]').on('switchChange.bootstrapSwitch', function(event, state) {
                console.log(this); // DOM element
                console.log(event); // jQuery event
                console.log(state); // true | false
            });


            $('input[name="shareSwitch"]').on('switchChange.bootstrapSwitch', function(event, state) {
                console.log(this); // DOM element
                console.log(event); // jQuery event
                console.log(state); // true | false
            });

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
            };
            $scope.disableEditor2 = function() {
                $scope.editor2Enabled = false;
            };

            //$('#pushAppSelect').on('change', function(){
            //    console.log($scope.default_installed);
            //    console.log()
            //});
            $scope.changeOption = function() {
                console.log($scope.default_installed);
                AppDataProvider.changeInstallationOption($scope.app._id, $scope.default_installed)
                    .success(function() {
                        //$scope.default_installed = newApp.default_installed;
                    console.log('changed success');
                })
                    .error(function(err) {
                        swal({title: '修改失败', text: '请重试', timer: 2000 });
                    console.error(err);
                });
            };

            var hasTheApp = function(roomId) {
                var deferred = $q.defer();
                RoomDataProvider.getRoom(roomId).then(function(room) {
                     deferred.resolve(room.apps && room.apps.indexOf(theApp._id) > -1);
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
                queueLimit: 1
            });


            $scope.uploader.onSuccessItem = function(item, response, status) {
                $('#uploadApkDialog').modal('hide');
                if(status === 201) {
                    swal({title: " 上传成功",text: "您之前已上传过此版本的APK文件，新上传文件已覆盖之前文件",type: 'success', timer: 4000});
                }else if(status === 200) {
                    swal({title: " 上传成功",type: 'success', timer: 2000});
                    $scope.app.apks.push(response);
                }
                $scope.uploader.clearQueue();
                $scope.app.package = response.package;
                $scope.error = {};
            };

            $scope.uploader.onErrorItem = function(item, response, status) {
                swal({title: " 上传失败", text: response.message,type: 'error'});
                if (status == 406) {
                    $scope.error.package = true;
                    //$scope.uploader.clearQueue();
                }
            };
            $scope.uploaderAddingFile = function(item) {
                $scope.error.package = false;
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
                    return this.queue.length < 2;
                }
            });

            $scope.gridOptions =
            {
                data: 'app.apks',
                multiSelect: false,
                enableColumnResize: true,
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'id', displayName: 'ID', width: '15%'},
                    {field: 'versionName', displayName: '版本名称', width: '10%'},
                    {field: 'versionCode', displayName: '版本号', width: '10%'},
                    {field: 'package', displayName: '内部包名'},
                    {field: 'fileName', displayName: '安装包', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/download/apks/{{row.entity.id}}">{{row.getProperty(col.field)}}</a></div>'},
                    {field: 'size', displayName: '大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field]/1024/1024 | number:2}} MB</div>'},
                    {field: '', displayName: '操作', visible: $scope.isRootOrAdminOrSelf, cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()">' +
                    '<a class="fui-cross-circle text-danger" role="button" ng-click="deleteApk(row)"></a></div>'}
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
            };


            if ($('[data-toggle="switch"]').length) {
                $('[data-toggle="switch"]').bootstrapSwitch();
            }
            $("#pushAppSwitch").bootstrapSwitch();
            $("[name='pushAppSwitch']").bootstrapSwitch();
            // Custom Selects
            if ($('[data-toggle="select"]').length) {
                $('[data-toggle="select"]').select2();
            }
            $("select").select2({dropdownCssClass: 'dropdown-inverse'});
            // Focus state for append/prepend inputs
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.input-group, .form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.input-group, .form-group').removeClass('focus');
            });
            $('[data-toggle="checkbox"]').radiocheck();
            $('[data-toggle="radio"]').radiocheck();



            //$('#change-color-switch').bootstrapSwitch('onColor', 'success');
            //$('#change-color-switch').bootstrapSwitch('offColor', 'danger');

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
