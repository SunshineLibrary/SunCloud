angular.module('schools')
    .controller('schoolsNavController', [
        '$scope',
        '$state',
        function($scope, $state) {
            $scope.items = [
                {name: '学校', state: 'schools'},
                {name:'学生', state: 'studentsAll'},
                {name:'老师', state: 'teachersAll'},
                {name:'班级', state: 'classesAll'},
                {name:'机器', state: 'tabletsAll'},
                {name:'应用程序', state: 'appsAll'},
                //{name:'模板', state: 'templateAll'},
                {name:'设置', state: 'settingAll'}];

            $scope.goto = function(state) {
                $state.transitionTo(state);
            };
        }
    ]);
