angular.module('schools')
    .controller('settingRootController', [
        'school',
        '$scope',
        '$location',
        '$state',
        'SchoolDataProvider',
        'TeacherDataProvider',
        'AuthService',
        function(school, $scope, $location, $state, SchoolDataProvider, TeacherDataProvider, AuthService) {

        }
    ]);
