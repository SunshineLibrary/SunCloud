angular.module('manage')
    .controller('myDeviceController', [
        'myDevice',
        '$scope',
        'AuthService',
        function(myDevice,$scope, AuthService) {
            $scope.me = AuthService.me;
            console.log(myDevice);
            if(myDevice.length) {
                $scope.mytablet = myDevice[0].tabletId;
                $scope.mytablet.lastLogin = myDevice[0].login_at;
            }


            // Tabs
            $('.nav-tabs a').on('click', function (e) {
                e.preventDefault();
                $(this).tab('show');
            });


        }
    ]);
