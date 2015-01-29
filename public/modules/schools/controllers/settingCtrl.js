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

            $scope.hover = function(subject) {
                subject.showEdit = !subject.showEdit;
            };
            $scope.editSubject = function(subject) {
                SubjectDataProvider.editSubject(subject)
                    .success(function() {
                    })
                    .error(function(err) {
                        console.error(err);
                    })
            };
            $scope.editSemester = function(semester) {
                SemesterDataProvider.editSemester(semester)
                    .success(function() {
                    })
                    .error(function(err) {
                        console.error(err);
                    })
            };
            $scope.removeSubject = function(subject) {
                swal({
                        title: "删除科目",
                        text: "您确定要删除科目"+subject.name+"吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        SubjectDataProvider.deleteSubject(subject._id)
                            .success(function() {
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.subjects.splice($scope.subjects.indexOf(subject),1);
                            })
                            .error(function(err) {
                                console.error(err);
                                swal({title: "删除失败", text: "", type: 'error'})

                            })
                    });

            };
            $scope.removeSemester = function(semester) {
                swal({
                        title: "删除年级",
                        text: "您确定要删除年级"+semester.name+"吗?",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        SemesterDataProvider.deleteSemester(semester._id)
                            .success(function() {
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.semesters.splice($scope.semesters.indexOf(semester),1);
                            })
                            .error(function(err) {
                                console.error(err);
                                swal({title: "删除失败", text: "", type: 'error'})

                            })
                    });

            }
        }
    ]);
