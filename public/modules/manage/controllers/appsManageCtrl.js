angular.module('manage')
    .controller('appsManageController',
    ['apps', 'myRooms', 'AppDataProvider', 'RoomDataProvider','$scope', 'AuthService', '$location', '$q',
        function (apps, myRooms, AppDataProvider, RoomDataProvider,$scope, AuthService, $location, $q) {
            $scope.apps = apps;
            $scope.myRooms = myRooms;
            $scope.temp = {};
            $scope.seletedApp = [];
            $scope.selectedRoom = $scope.myRooms[0];
            $scope.myRooms[0].isActive = true;
            $scope.newAppName = '';
            $scope.filterOptions = {filterText: ''};
            var me = AuthService.me;
            $scope.me = me;

            $scope.$watch('apps', function(newApps) {
                if(newApps) {
                    $scope.apps = newApps;
                }
            }, true);

            _.each($scope.apps, function(app) {
                app.room = [];
            });
            _.each($scope.myRooms, function(myRoom) {
                _.each(myRoom.apps, function(appId) {
                    var theApp = _.find($scope.apps, function(app) {
                        return app._id === appId
                    });
                    if(theApp) {
                        theApp.room = theApp.room.concat(myRoom.name);
                    }
                })
            });


            AppDataProvider.getAppsByRoom($scope.selectedRoom._id).then(function(appsOfTheRoom) {
                $scope.appsOfRoom =  appsOfTheRoom;
                $scope.otherApps = _.filter($scope.apps, function(app){
                    return !_.findWhere($scope.appsOfRoom, {_id: app._id})
                })
            });

            $scope.selectOneRoom = function(selectedRoom) {
                $scope.selectedRoom  = selectedRoom;
                AppDataProvider.getAppsByRoom($scope.selectedRoom._id).then(function(appsOfTheRoom) {
                    $scope.appsOfRoom =  appsOfTheRoom;
                    $scope.otherApps = _.filter($scope.apps, function(app){
                        return !_.findWhere($scope.appsOfRoom, {_id: app._id})
                    })
                });
                _.each($scope.myRooms, function(item) {
                    item.isActive = selectedRoom._id === item._id ;
                });
            };


            $scope.createApp = function() {
                $scope.temp.error = '';
                if (($scope.newAppName == "") || ($scope.newAppName === undefined)) {
                    $scope.temp.error = 'noName';
                    return;
                }
                var apps = $scope.apps;
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i].name == $scope.newAppName.trim()) {
                        $scope.temp.error = 'alreadyHave';
                        return;
                    }
                }
                $('#createAppDialog').modal('hide');
                AppDataProvider.createApp($scope.newAppName.trim(), me, 'teacher')
                    .success(function(newApp) {
                        $('#createAppModal').modal('hide');
                        $location.path('/apps/' + newApp._id)
                    }).error(function(err) {
                        $scope.temp.error = 'failure';
                        console.error(err);
                    })
            };

            $scope.goToApp = function(appId) {
                $location.path('/apps/' + appId);
            };
            $scope.addAppToRoom = function(app) {
                AppDataProvider.addAppToRoom(app._id, $scope.selectedRoom._id)
                    .success(function() {
                        $scope.appsOfRoom.push(app);
                        $scope.otherApps = _.reject($scope.otherApps, function(theApp) {
                            return theApp._id === app._id;
                        });
                        var theApp = _.findWhere($scope.apps, {_id: app._id});
                        theApp.room.push($scope.selectedRoom.name);
                    })
            };

            $scope.removeAppFromRoom = function(app) {
                AppDataProvider.removeAppFromRoom(app._id, $scope.selectedRoom._id)
                    .success(function() {
                        $scope.appsOfRoom = _.reject($scope.appsOfRoom, function(theApp) {
                            return theApp._id === app._id});
                        $scope.otherApps.push(app);
                        var theApp = _.findWhere($scope.apps, {_id: app._id});
                        theApp.room = _.without(theApp.room, $scope.selectedRoom.name);
                    })
            };


            $scope.gridOptions =
            {
                data: 'apps',
                multiSelect: false,
                filterOptions: $scope.filterOptions,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '应用程序名称', width: '15%'},// cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/#/apps/{{row.entity._id}}">{{row.getProperty(col.field)}}</a></div>'},
                    {field: 'package', displayName: '应用的包名', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.package">' +
                    '{{row.getProperty(col.field)}}</div>' +
                    '<div ng-hide="row.entity.package"><span class="label label-default">暂无</span></div>'},
                    {field:'room', displayName: '分配班级', width: '50%',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" ' +
                    'ng-show="row.entity.room.length"><span ng-repeat="r in row.entity.room"><span class="label label-info inline"> {{r}}</span>&nbsp;&nbsp;</span></div>' +
                    '<div ng-hide="row.entity.room.length"><span class="label label-default">暂无</span></div>'},
                    {field: '', displayName: '操作',width:'5%',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.teacher === me._id">' +
                    '<a class="glyphicon glyphicon-remove text-success" role="button" ng-click="deleteApp($event, row)"></a></div>'}
                ],
                selectedItems: $scope.seletedApp
            };

            $scope.selectApp = function () {
                $location.path('/apps/' + $scope.gridOptions.selectedItems[0]._id);
            };

            $scope.deleteApp = function (event, row) {
                event.stopPropagation();
                swal({
                        title: "您确定要删除此应用程序吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        AppDataProvider.deleteApp(row.entity._id)
                            .success(function(app){
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.apps.splice($scope.apps.indexOf(row.entity),1);
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "删除失败", text: "请重试", type: 'error', timer: 1000})

                            })
                    });
            }
        }]);
