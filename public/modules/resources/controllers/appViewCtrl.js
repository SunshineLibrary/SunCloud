angular.module('resources')
    .controller('appViewController',
    ['theApp','AppDataProvider', 'RoomDataProvider', '$scope', '$stateParams', 'FileUploader', 'AuthService', '$q',
        function (theApp,AppDataProvider, RoomDataProvider,$scope, $stateParams, FileUploader, AuthService, $q) {
            $scope.app = theApp;
            var me = AuthService.me;
            $scope.roles = AuthService.me.roles;
            $scope.myRooms = [];
            $scope.error = {};
            $scope.editorEnabled = false;
            $scope.editor2Enabled = false;
            $scope.selectedRooms = [];
            $scope.pushOptions = [{value: false, name: '需要手动分配给班级'},{value: true, name: '默认分配给所有班级'}];

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

            var getMyRooms= function() {
                var defered = $q.defer();
                if(me.roles.indexOf('teacher') > -1 && me.roles.indexOf('admin') > -1  ) {
                    RoomDataProvider.getRoomsByTeacher(me._id)
                        .then(function(rooms) {
                            $scope.myRooms = rooms;
                            return  RoomDataProvider.getAdminRoomsMinBySchool(me.school);
                        }).then(function(rooms) {
                            $scope.myRooms = _.filter($scope.myRooms, function(room) {
                                return room.type = 'teaching';
                            });
                            $scope.myRooms = $scope.myRooms.concat(rooms);
                            defered.resolve($scope.myRooms);
                        });
                }else if(me.roles.indexOf('teacher') > -1){
                    RoomDataProvider.getRoomsByTeacher(me._id).then(function(rooms) {
                        $scope.myRooms = rooms;
                        defered.resolve($scope.myRooms);
                    });
                }else {
                    RoomDataProvider.getAdminRoomsMinBySchool(me.school).then(function(rooms) {
                        $scope.myRooms = rooms;
                        defered.resolve($scope.myRooms);
                    })
                }
                return defered.promise;
            };


            getMyRooms().then(function(myRooms) {
                $scope.myRoomsNotAssigned = _.filter(myRooms, function(room) {
                   return theApp.rooms.indexOf(room._id) === -1 ;
                });
                $scope.myRoomsAssigned = _.filter(myRooms, function(room) {
                    return theApp.rooms.indexOf(room._id) !== -1 ;
                });
                console.log(theApp.rooms);
                console.log($scope.myRoomsAssigned);
                _.each($scope.myRooms, function(room, i) {
                    $scope.selectedRooms[i] = theApp.rooms.indexOf(room._id) > -1;

                });
            });

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
                    {field: 'versionName', displayName: '版本名称'},
                    {field: 'versionCode', displayName: '版本号'},
                    {field: 'package', displayName: '内部包名'},
                    {field: 'fileName', displayName: '安装包', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/download/apks/{{row.entity._id}}">{{row.getProperty(col.field)}}</a></div>'},
                    {field: 'size', displayName: '大小', cellTemplate: '<div>{{row.entity[col.field]/1024/1024 | number:2}} MB</div>'},
                    {field: '', displayName: '操作', cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()">' +
                    '<a class="glyphicon glyphicon-remove text-primary" role="button" ng-click="deleteApk(row)"></a></div>'}
                ]
            };

            $scope.checkAll = function() {
               $scope.selectedRooms = $scope.selectedRooms.map(function(item) {return true});
                console.log($scope.selectedRooms)

            };
            $scope.uncheckAll = function() {
                $scope.selectedRooms = $scope.selectedRooms.map(function(item) {return false});

            };
            $scope.assignToRooms = function() {
                var theSelectedRooms = _.filter($scope.myRooms, function(room, i) {
                    return $scope.selectedRooms[i];
                });
                var theSelectedRoomsId = theSelectedRooms.map(function(item) {return item._id});
                AppDataProvider.addAppToRooms(theApp, theSelectedRoomsId)
                    .success(function(newApp) {
                        $('#assignAppDialog').modal('hide');
                        swal({title:"分配成功", type: "success", timer: 1000});
                        $scope.myRoomsNotAssigned = _.filter($scope.myRoomsNotAssigned, function(room) {
                           return  theSelectedRoomsId.indexOf(room._id) === -1;
                        });
                        $scope.myRoomsAssigned = _.filter($scope.myRooms, function(room) {
                           return theSelectedRoomsId.indexOf(room._id) > -1;
                        });
                    })
                    .error(function(err){
                        console.error(err);
                        swal({title:"分配失败", text: "请重试", type: "error", timer: 2000})
                    })
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
                        var newApp = $scope.app;
                        newApp.apks.splice(newApp.apks.indexOf(row.entity),1);
                        if(newApp.apks.length) {
                            var max = newApp.apks[0];
                            _.each(newApp.apks, function(apk) {
                                max = (apk.versionCode > max.versionCode) ? apk: max ;
                            });
                            newApp.versionCode = max.versionCode;
                            newApp.versionName = max.versionName;
                            newApp.package = max.package;
                            newApp.file_name =max.fileName;
                        }else {
                            newApp.versionCode = null;
                            newApp.versionName = null;
                            newApp.package = null;
                            newApp.file_name = null;
                        }
                        AppDataProvider.updateApp(newApp)
                            .success(function(app){
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.app = app;
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "删除失败", text: "请重试", type: 'error'})
                            })
                    });
            }
        }
    ]
).filter('existFilter', function(input) {
        return input.length? input: '暂无'
    });