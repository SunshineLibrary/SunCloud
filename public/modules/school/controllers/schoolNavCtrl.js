angular.module('schoolManage')
    .controller('schoolNavController', [
        '$scope',
        '$state',
        function($scope, $state) {
            $scope.items = [
                {name: '学校', state: 'schoolInfo'},
                {name:'班级', state: 'classes'},
                {name:'学生', state: 'students'},
                {name:'老师', state: 'teachers'},
                {name:'应用程序', state: 'apps'},
                {name:'晓书', state: 'tablets'},
                //{name:'模板', state: 'template'},
                {name:'设置', state: 'setting'}];

            //$state.transitionTo('schoolInfo');

            //$scope.selectedState = $scope.items[0].state;
            $scope.goto = function(state) {
                //$scope.selectedState = state;
                $state.transitionTo(state);
            };
        }
    ]);
