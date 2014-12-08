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
            $scope.mytablet = myDevice[0].tabletId;
            $scope.mytablet.lastLogin = myDevice[0].login_at;
            console.log($scope.mytablet);


        }
    ]);
