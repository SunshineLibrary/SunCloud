angular.module('manage')
    .controller('myDeviceController', [
        'myDevice',
        '$scope',
        '$location',
        '$routeParams',
        '$state',
        'AuthService',
        function(myDevice,$scope, $location, $routeParams, $state, AuthService) {
            $scope.me = AuthService.me;
            console.log(myDevice);
            if(myDevice.length) {
                $scope.mytablet = myDevice[0].tabletId;
                $scope.mytablet.lastLogin = myDevice[0].login_at;
            }



        }
    ]);
