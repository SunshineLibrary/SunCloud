angular.module('manage')
    .controller('manageNavController', [
        '$scope',
        '$state',
        function($scope, $state) {
            $scope.items = [
                {name: '我的设备', state: 'myDevice'},
                {name: '应用程序', state: 'appsManage'},
                {name: '登录管理', state: 'logManage'},
                {name: '锁屏管理', state: 'lockView'},
                {name:'设置', state: 'mySetting'}];

            //$state.transitionTo('myDevice');
            //$location.path('/manage/mydevice');

            //$scope.selectedState = $scope.items[0].state;
            $scope.goto = function(state) {
                //$scope.selectedState = state;
                $state.transitionTo(state);
            };
        }
    ]);
