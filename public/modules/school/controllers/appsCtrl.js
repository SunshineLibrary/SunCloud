angular.module('schools')
    .controller('appsController',
    ['apps', 'AppDataProvider', '$scope', 'AuthService', '$location',
        function (apps, AppDataProvider, $scope, AuthService, $location) {
            $scope.apps = apps;
            $scope.temp = {};
            var me = AuthService.me;
            $scope.me = me;
            $scope.seletedApp = [];
            $scope.newAppName = '';
            $scope.filterOptions = {filterText: ''};

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
                AppDataProvider.createApp($scope.newAppName.trim(), me, 'admin')
                    .success(function(newApp) {
                        $('#createAppModal').modal('hide');
                        $location.path('/apps/' + newApp._id)
                    }).error(function(err) {
                        $scope.temp.error = 'failure';
                        console.error(err);
                    })
            };

            $scope.gridOptions =
            {
                data: 'apps',
                multiSelect: false,
                enableColumnResize: true,
                filterOptions: $scope.filterOptions,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '应用程序名称', cellTemplate: '<a href="">{{row.entity.name}}</a>'},// cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/#/apps/{{row.entity._id}}">{{row.getProperty(col.field)}}</a></div>'},
                    {field: 'package', displayName: '应用的包名', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.package">' +
                    '{{row.getProperty(col.field)}}</div>' +
                    '<div ng-hide="row.entity.package"><span class="label label-default">暂无</span></div>'},
                    {field: '', displayName: '操作',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.school === me.school && showedit">' +
                    '<a class="fui-cross text-danger" role="button" ng-click="deleteApp($event, row)"></a></div>'}
                ],
                selectedItems: $scope.seletedApp
            };

            $scope.selectApp = function () {
                $location.path('/apps/' + $scope.gridOptions.selectedItems[0]._id);
            };

            $scope.deleteApp = function (event, row) {
                event.stopPropagation();
                sweetAlert({
                        title: "您确定要删除此应用程序吗?",
                        text: "删除之后，该应用程序所有信息将无法找回。",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        AppDataProvider.deleteApp(row.entity._id)
                            .success(function(app){
                                sweetAlert({title: "删除成功", type: "success", timer: 1000 });
                                $scope.apps.splice($scope.apps.indexOf(row.entity),1);
                            })
                            .error(function(err){
                                console.error(err);
                                sweetAlert({title: "删除失败", text: "请重试", type: 'error', timer: 1000})

                            })
                    });
            }
        }]);
