angular.module('sunpack')
    .controller('repoSubjectController',
    ['$state', 'subject', '$scope', 'FileDataProvider',
        function ($state, subject, $scope, FileDataProvider) {
            $scope.subject = subject;
            //$scope.sharedFoldersCount = sharedFoldersCount;
            //$scope.sharedFilesCount = sharedFilesCount;
            _.each($scope.semesters, function(semester) {
                //FolderDataProvider.getSharedFoldersBySubjectAndSemesterCount(subject._id, semester._id).then(function(count) {
                //    semester.sharedFoldersCount = count;
                //});
                FileDataProvider.getSharedFilesBySubjectAndSemesterCount(subject._id, semester._id).then(function(count) {
                    semester.sharedFilesCount = count;
                });
                //console.log(semester.sharedFoldersCount);
            })
        }
    ]
);