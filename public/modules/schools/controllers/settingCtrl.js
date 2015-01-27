angular.module('schools')
    .controller('settingRootController', [
        '$scope', 'subjects', 'semesters', 'SubjectDataProvider','SemesterDataProvider',
        function($scope, subjects, semesters, SubjectDataProvider, SemesterDataProvider) {
            $scope.subjects = subjects;
            $scope.semesters = semesters;
            $scope.isCreatingSubject = false;
            $scope.isCreatingSemester = false;
            $scope.tmp = {};

            $scope.createSubject = function() {
                SubjectDataProvider.createSubject($scope.tmp.subject)
                    .success(function(newSubject) {
                        $scope.subjects.push(newSubject);
                        $scope.isCreatingSubject = false;
                        $scope.tmp.subject = '';
                    })
                    .error(function(err) {
                        console.error(err);
                    })
            };
            $scope.createSemester = function() {
                SemesterDataProvider.createSemester($scope.tmp.semester)
                    .success(function(newSemester) {
                        $scope.semesters.push(newSemester);
                        $scope.isCreatingSemester = false;
                        $scope.tmp.semester = '';
                    })
                    .error(function(err) {
                        console.error(err);
                    })
            };

            $scope.editSubject = function() {


            }
        }
    ]);
