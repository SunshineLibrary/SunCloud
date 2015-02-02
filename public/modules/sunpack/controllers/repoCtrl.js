angular.module('sunpack')
    .controller('repoController',
    ['$scope', '$state', 'FolderDataProvider', 'FileDataProvider', 'AuthService',function ($scope, $state, FolderDataProvider, FileDataProvider, AuthService) {
        //$scope.showingSemester = false;
        var me = AuthService.me;
        $scope.showSemester = function(subject) {
            subject.mouseOn = true;
            console.log('mouse over');

        };
        $scope.hideSemester = function(subject) {
            console.log('mouse leave');
            subject.mouseOn = false;
        };

        _.each($scope.subjects, function(subject) {
            //FolderDataProvider.getSharedFoldersBySubjectCount(subject._id).then(function(count) {
            //    subject.sharedFoldersCount = count;
            //    console.log(count);
            //});
            FileDataProvider.getSharedFilesBySubjectAndSchoolCount(subject._id, me.school).then(function(count) {
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