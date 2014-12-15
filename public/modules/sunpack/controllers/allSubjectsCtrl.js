angular.module('sunpack')
    .controller('allSubjectsController',
    ['subjects', 'AuthService', '$scope',
        function (subjects, AuthService, $scope) {

            $scope.subjects = subjects;
            console.log($scope.subjects);

        }
    ]
);