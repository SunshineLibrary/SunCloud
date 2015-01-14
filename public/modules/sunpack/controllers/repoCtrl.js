angular.module('sunpack')
    .controller('repoController',
    ['$scope', '$state', 'FolderDataProvider', 'FileDataProvider', function ($scope, $state, FolderDataProvider, FileDataProvider) {
        //$scope.showingSemester = false;
        $scope.showSemester = function(subject) {
            subject.mouseOn = true;
            console.log('mouse over');

        };
        $scope.hideSemester = function(subject) {
            console.log('mouse leave');
            subject.mouseOn = false;
        };

        _.each($scope.subjects, function(subject) {
            FolderDataProvider.getSharedFoldersBySubjectCount(subject._id).then(function(count) {
                subject.sharedFoldersCount = count;
                console.log(count);
            });
            FileDataProvider.getSharedFilesBySubjectCount(subject._id).then(function(count) {
                subject.sharedFilesCount = count;
            });
            //console.log(semester.sharedFoldersCount);
        });

        $scope.goto = function(event, subjectId, semesterId) {
            event.preventDefault();
            event.stopPropagation();
            $state.go('sunpack.repo.subject.semester', {subjectId: subjectId, semesterId: semesterId})
        };

    }]);