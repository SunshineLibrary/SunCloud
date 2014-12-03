angular.module('schoolManage')
    .controller('settingController', [
        'school',
        '$scope',
        '$location',
        '$state',
        'SchoolDataProvider',
        function(school, $scope, $location, $state, SchoolDataProvider) {
            $scope.school = school;
            $scope.isResettingPassword = false;
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
            }

        }
    ]);
