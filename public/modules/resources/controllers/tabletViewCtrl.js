angular.module('resources')
    .controller('tabletViewController',
    ['theTablet','TabletDataProvider', '$scope', 'AuthService',
        function (theTablet,TabletDataProvider, $scope, AuthService) {
            $scope.tablet = theTablet;
            console.log(theTablet);
            var me = AuthService.me;
            $scope.isInSameSchool = me.roles.indexOf('root') > -1 || $scope.tablet.school._id.toString() === me.school.toString();

            TabletDataProvider.getTabletUser($scope.tablet._id).success(function(record){
                if(record.length){
                    $scope.user = record[0].userId;
                    $scope.role = $scope.user.roles.indexOf('teacher') > -1 ? 'teachers' : 'students';
                }else{
                    $scope.user = null;
                }
            });

            $scope.logout = function () {
                sweetAlert({
                        title: "登出晓书",
                        text: "您确定要将"+$scope.user.name+"登出晓书吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: false },
                    function(){
                        TabletDataProvider.logout($scope.user._id, $scope.tablet._id)
                            .success(function(record){
                                $scope.user = null;
                                sweetAlert({title: "登出成功", type: "success", timer: 1500 });
                            })
                            .error(function(err){
                                console.error(err);
                                sweetAlert({title: "登出失败", text: "请重试", type: 'error', timer: 2000})
                            });
                    });

            };

        }
    ]
);