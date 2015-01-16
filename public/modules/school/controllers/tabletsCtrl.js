angular.module('schoolManage')
    .controller('tabletsController',
    ['tablets', 'TabletDataProvider', '$scope',
        function (tablets, TabletDataProvider, $scope) {
            $scope.tablets = tablets;
            $scope.selectedTablet = [];
            $scope.filterOptions = {filterText: ''};

            _.each($scope.tablets, function(tabletItem) {
                TabletDataProvider.getTabletUser(tabletItem._id).success(function (records) {
                    console.log(records);
                    if(records.length) {
                        tabletItem.userId = records[0].userId._id;
                        tabletItem.userName = records[0].userId.name;
                        tabletItem.update_at = records[0].update_at;
                    }
                }).error(function(err) {
                    console.error(err);
                });
            });


            $scope.gridOptions =
            {
                data: 'tablets',
                multiSelect: false,
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'machine_id', displayName: '晓书编号', width: '25%', cellTemplate: '<a ng-href="/#/tablets/{{row.entity._id}}">{{row.entity.machine_id}}</a>' },
                    {field: 'OS_type', displayName: '操作系统'},
                    {field: 'OS_version', displayName: '版本', width: '10%'},
                    {field: 'update_at', displayName: '上次更新', width: '20%', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.update_at"></span>'},
                    {field: 'userName', displayName: '正在使用',
                        cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.userName">' +
                        '<a href="/#/students/{{row.entity.userId}}">{{row.getProperty(col.field)}}</a></div>' +
                        '<div ng-hide="row.entity.userName"><span class="label label-default">暂无</span></div>'},
                    {field: 'userId', displayName: '', cellTemplate:'<button type="button" class="btn btn-danger btn-xs" ng-click="logout($event, row)" ng-show="row.entity.userName"><span class="glyphicon glyphicon-log-out"></span> 登出</button>'}

                ],
                selectedItems: $scope.selectedTablet,
                filterOptions: $scope.filterOptions
            };

            $scope.logout = function (event, row) {
                event.stopPropagation();
                swal({
                        title: "登出晓书",
                        text: "您确定要将"+row.entity.userName+"登出晓书吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: false },
                    function(){
                        TabletDataProvider.logout(row.entity.userId, row.entity._id)
                            .success(function(record){
                                row.entity.userId = null;
                                row.entity.userName = null;
                                //row.entity.loginTime = null;
                                swal({title: "登出成功", type: "success", timer: 1500 });
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "登出失败", text: "请重试", type: 'error', timer: 2000})
                            });
                    });

            };

            //$scope.selectTablet = function () {
            //    $location.path('/tablets/' + $scope.gridOptions.selectedItems[0]._id);
            //};
        }
    ])
    .filter('tabletFilter', function() {
        return function(input) {
            return input ? input : '暂无';
        }
    });
