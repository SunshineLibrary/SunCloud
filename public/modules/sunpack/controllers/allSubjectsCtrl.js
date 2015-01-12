angular.module('sunpack')
    .controller('allSubjectsController',
    ['subjects','semesters', 'myRooms', 'Authentication', '$scope', 'TeacherDataProvider', 'FolderDataProvider', '$state',
        function (subjects, semesters, myRooms,Authentication, $scope, TeacherDataProvider, FolderDataProvider, $state) {
            $scope.subjects = subjects;
            $scope.semesters = semesters;
            $scope.myRooms = myRooms;
            $scope.mySubjects = [];
            $scope.subjectsNotIn = [];
            var me = Authentication.user;
            _.each($scope.subjects, function(subject) {
                if(me.subjects.indexOf(subject._id) === -1) {
                    $scope.subjectsNotIn.push(subject);
                }else {
                    FolderDataProvider.getFoldersCountByTeacherAndSubject(me._id, subject._id).then(function(count) {
                        subject.count = count;
                        $scope.mySubjects.push(subject);
                    });
                }
            });


            $scope.selectedSubject = $scope.mySubjects[0];


            $scope.addSubject = function(subject) {
            TeacherDataProvider.addSubject(me._id, subject._id)
                .success(function() {
                    $scope.mySubjects.push(subject);
                    $scope.subjectsNotIn.splice($scope.subjectsNotIn.indexOf(subject), 1);
                })
                .error(function(err) {
                    console.error(err);
                    swal({title: "添加科目失败", text: "请重试", type: "error", timer: 2000});
                })
        };

            $scope.hover = function(subject) {
                // Shows/hides the delete button on hover
                return subject.showDelete = ! subject.showDelete;
            };


            $scope.removeSubject = function(subject) {
                swal({
                        title: "您确定要移除"+subject.name+"吗?",
                        text: "移除之后，该科目下的文件夹也将会删除",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "移除",
                        closeOnConfirm: false },
                    function(){
                        TeacherDataProvider.removeSubject(me._id, subject._id)
                            .success(function() {
                                $scope.mySubjects.splice($scope.mySubjects.indexOf(subject), 1);
                                $scope.subjectsNotIn.push(subject);
                                console.log('success');
                                swal({title: "移除科目成功", type: "success", timer: 1500});
                            })
                            .error(function(err) {
                                console.error(err);
                                swal({title: "移除科目失败", text: "请重试", type: "error", timer: 2000});
                            })
                    });

            };




            $scope.selectSubject = function(subjectId) {
                $scope.label = '阳光书包';
                $state.go('sunpack.subject', {subjectId: subjectId});
            };
            $scope.selectRoom = function (roomId) {
                $scope.label = '我的班级';
                $state.go('sunpack.myroom', {roomId: roomId});
            };
            $scope.gotoRepo = function() {
              $scope.label = '资源库';
                $state.go('sunpack.repo')
            };

            $(document).ready(function(){
                $('select[name="inverse-dropdown"], select[name="inverse-dropdown-optgroup"], select[name="inverse-dropdown-disabled"]').select2({dropdownCssClass: 'select-inverse-dropdown'});

                $('select[name="searchfield"]').select2({dropdownCssClass: 'show-select-search'});
                $('select[name="inverse-dropdown-searchfield"]').select2({dropdownCssClass: 'select-inverse-dropdown show-select-search'});
            });
            // Custom Selects
            if ($('[data-toggle="select"]').length) {
                $('[data-toggle="select"]').select2();
            }
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();


            //console.log($scope.subjects);

        }
    ]
);