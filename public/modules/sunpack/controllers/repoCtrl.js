angular.module('sunpack')
    .controller('repoController',
    ['$scope', '$state', function ($scope, $state) {
        //$scope.showingSemester = false;
        $scope.showSemester = function(subject) {
            subject.mouseOn = true;
        };
        $scope.hideSemester = function(subject) {
            subject.mouseOn = false;
        };

        $scope.goto = function(subjectId, semesterId) {
            $state.go('sunpack.repo.subject.semester', {subjectId: subjectId, semesterId: semesterId})
        };

    }]);