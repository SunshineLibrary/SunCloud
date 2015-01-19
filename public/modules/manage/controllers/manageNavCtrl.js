angular.module('manage')
    .controller('manageNavController', [
        '$scope',
        '$state',
        '$rootScope',
        function($scope, $state, $rootScope) {
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

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){
                    //console.log('toState:',toState.name);
                    //console.log('fromState', fromState.name);
                    //if(toState.name === 'schoolNav') {
                    //    //$location.path('/school/info');
                    //}
                    if(toState.name === 'deviceManage') {
                        $state.transitionTo('myDevice');
                        //$location.path('/manage/mydevice');
                    }
                });




        }
    ]);
