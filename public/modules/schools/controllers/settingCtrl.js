angular.module('schools')
    .controller('settingRootController', [
        '$scope', 'subjects', 'semesters', 'SubjectDataProvider','SemesterDataProvider', '$q',
        function($scope, subjects, semesters, SubjectDataProvider, SemesterDataProvider, $q) {
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
                        if(err.code === 11000 || err.code === 11001) {
                            sweetAlert({title: '科目名'+ $scope.tmp.subject +'已存在', type: 'error'})
                        }else {
                            sweetAlert({title: '服务器错误', text: '请重试', type: 'error'})
                        }
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
                        if(err.code === 11000 || err.code === 11001) {
                            sweetAlert({title: '年级名'+ $scope.tmp.semester +'已存在', type: 'error'})
                        }else {
                            sweetAlert({title: '服务器错误', text: '请重试', type: 'error'})
                        }
                    })
            };

            $scope.hover = function(item) {
                item.showEdit = true;
            };
            $scope.leave = function(item) {
                item.showEdit = false;
            };
            $scope.editSubject = function(name, id) {
                return SubjectDataProvider.editSubject({name: name, _id: id});
            };
            $scope.editSemester = function(name, id) {
                return SemesterDataProvider.editSemester({name: name, _id: id});
            };
            $scope.removeSubject = function(subject) {
                sweetAlert({
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
                                sweetAlert({title: "删除成功", type: "success", timer: 1000 });
                                $scope.subjects.splice($scope.subjects.indexOf(subject),1);
                            })
                            .error(function(err) {
                                console.error(err);
                                sweetAlert({title: "删除失败", text: "", type: 'error'})

                            })
                    });

            };
            $scope.removeSemester = function(semester) {
                sweetAlert({
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
                                sweetAlert({title: "删除成功", type: "success", timer: 1000 });
                                $scope.semesters.splice($scope.semesters.indexOf(semester),1);
                            })
                            .error(function(err) {
                                console.error(err);
                                sweetAlert({title: "删除失败", text: "", type: 'error'})

                            })
                    });

            }
        }
    ]);
