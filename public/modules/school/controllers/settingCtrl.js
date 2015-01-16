angular.module('schoolManage')
    .controller('settingController', [
        'school',
        '$scope',
        'SchoolDataProvider',
        'TeacherDataProvider',
        'AuthService',
        function(school, $scope, SchoolDataProvider, TeacherDataProvider, AuthService) {
            $scope.school = school;
            $scope.isResettingPassword = false;
            $scope.selectedTeachers = [];
            $scope.filterOptions = {filterText: ''};
            $scope.selected = [];
            $scope.checkall = false;
            var me = AuthService.me;

            var allTeachersPromise = TeacherDataProvider.getTeachersBySchool(me.school);

            $scope.enableEditor = function() {
                $scope.isResettingPassword = true;
            };
            $scope.disableEditor = function() {
                $scope.isResettingPassword = false;
            };
            $scope.save = function() {
                SchoolDataProvider.resetLauncherPassword(school._id, $scope.newPassword)
                    .success(function(newSchool) {
                        $scope.school.launcherPassword = newSchool.launcherPassword;
                        $scope.isResettingPassword = false;
                        swal({title: "重置密码成功", type: "success", timer: 1500});
                    }).error(function(err) {
                        console.error(err);
                        swal({title: "重置密码失败", text:"请重试", type: "error", timer: 2000});
                    })
            };

            $scope.toSet = function() {
                allTeachersPromise.then(function(teachers) {
                    console.log(teachers);
                    $scope.teachers = _.filter(teachers, function(teacher) {
                        return teacher.roles.indexOf('teacher') > -1 && teacher.roles.indexOf('admin') === -1 && teacher.roles.indexOf('root') === -1;
                    });
                    _.each($scope.teachers, function(teacher, i) {
                        $scope.selected[i] = teacher.canCreateApp;
                    });
                    console.log($scope.teachers);
                    $('#whoCanCreateAppDialog').modal('show');
                })

            };

            //$scope.checkAll = function() {
            //    if($scope.checkall) {
            //        $scope.selected = _.map($scope.selected, function(item) {
            //            return true;
            //        });
            //    }else {
            //        $scope.selected = _.map($scope.selected, function(item) {
            //            return false;
            //        })
            //    }
            //    $scope.checkall = !$scope.checkall;
            //
            //};
            $scope.checkAll = function() {
                //_.each($scope.selected, function(selection) {
                //    selection = $scope.checkall;
                //})
                $scope.selected = _.map($scope.selected, function() {return $scope.checkall})
            };

            $scope.createAppAccess = function() {
                _.each($scope.teachers, function(teacher, i) {
                    teacher.canCreateApp = $scope.selected[i];
                });
                var permissions = _.map($scope.teachers, function(teacher) {
                    return {teacherId: teacher._id, canCreateApp: teacher.canCreateApp};
                });

                async.each(permissions, function(permission, callback) {
                    TeacherDataProvider.editTeacherPermission(permission.teacherId, permission.canCreateApp)
                        .success(function(teacher) {
                            callback()
                        })
                        .error(function(err) {
                            console.error(err);
                            callback(err);
                        })
                }, function(err) {
                    if(err) {
                        swal({title: "修改权限失败", text: "请重试", type: "error", timer: 2000 });
                    }else {
                        $('#whoCanCreateAppDialog').modal('hide');
                        swal({title: "修改权限成功", type: "success", timer: 1500});
                    }
                })
            };

            $scope.gridOptions =
            {
                data: 'teachers',
                multiSelect: true,
                showSelectionCheckbox: true,
                checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                //checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
                //checkboxHeaderTemplate:'<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '姓名'},
                    {field: 'username', displayName: '用户名'}
                ],
                selectedItems: $scope.selectedTeachers,
                filterOptions: $scope.filterOptions
            };
            $('[data-toggle="checkbox"]').radiocheck();
            //$('[data-toggle="radio"]').radiocheck();




        }
    ]);
