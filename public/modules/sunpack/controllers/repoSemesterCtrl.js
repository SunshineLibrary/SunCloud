angular.module('sunpack')
    .controller('repoSemesterController',
    ['sharedFilesOfSemester', 'sharedFoldersOfSemester', '$scope', 'SubjectDataProvider', 'FolderDataProvider', 'SemesterDataProvider','$stateParams', 'semester', '$state',
        function (sharedFilesOfSemester, sharedFoldersOfSemester, $scope, SubjectDataProvider, FolderDataProvider, SemesterDataProvider, $stateParams, semester, $state) {
            $scope.semester = semester;
            $scope.newFolder = {};
            $scope.sharedFilesOfSemester = sharedFilesOfSemester;
            $scope.sharedFoldersOfSemester = sharedFoldersOfSemester;
            console.log(semester);
            console.log(sharedFilesOfSemester);
            console.log(sharedFoldersOfSemester);
            console.log('~~~~~~~~~~~~~~~~~~~');
        }
    ]
);