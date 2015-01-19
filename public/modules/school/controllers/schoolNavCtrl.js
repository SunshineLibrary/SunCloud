angular.module('schoolManage')
    .controller('schoolNavController', [
        '$scope',
        '$state',
        '$rootScope',
        function($scope, $state, $rootScope) {
            $rootScope.$state = $state;
            $scope.items = [
                {name: '学校', state: 'schoolInfo'},
                {name:'班级', state: 'classes'},
                {name:'学生', state: 'students'},
                {name:'老师', state: 'teachers'},
                {name:'应用程序', state: 'apps'},
                {name:'晓书', state: 'tablets'},
                //{name:'模板', state: 'template'},
                {name:'设置', state: 'setting'}];
            //console.log($state.current.name);

            //$state.transitionTo('schoolInfo');

            //$scope.selectedState = $scope.items[0].state;
            $scope.goto = function(state) {
                //$scope.selectedState = state;
                $state.transitionTo(state);
            };
            //$rootScope.$on('$stateChangeSuccess',
            //    function(event, toState, toParams, fromState, fromParams){
            //        //console.log('toState:',toState.name);
            //        //console.log('fromState', fromState.name);
            //        //if(toState.name === 'schoolNav') {
            //        //    //$location.path('/school/info');
            //        //}
            //        if(toState.name === 'schoolNav') {
            //            $state.transitionTo('schoolInfo');
            //            //$location.path('/manage/mydevice');
            //        }
            //    });

        }
    ]);
