angular.module('sunpack')
    .controller('homeController',
    ['subjects','semesters', 'myRooms', 'Authentication', '$scope', 'TeacherDataProvider', 'FolderDataProvider', 'RoomDataProvider','$state', '$rootScope',
        function (subjects, semesters, myRooms,Authentication, $scope, TeacherDataProvider, FolderDataProvider, RoomDataProvider,$state, $rootScope) {
            $scope.subjects = subjects;
            $scope.semesters = semesters;
            $scope.myRooms = myRooms;
            $scope.mySubjects = [];
            $scope.subjectsNotIn = [];
            $scope.me = Authentication.user;
            _.each($scope.subjects, function(subject) {
                if($scope.me.subjects.indexOf(subject._id) === -1) {
                    $scope.subjectsNotIn.push(subject);
                }else {
                    FolderDataProvider.getFoldersCountByTeacherAndSubject($scope.me._id, subject._id).then(function(count) {
                        subject.count = count;
                        $scope.mySubjects.push(subject);
                    });
                }
            });

            _.each($scope.myRooms, function(room) {
                RoomDataProvider.getFoldersCountByRoomAndTeacher(room._id, $scope.me._id).success(function(count) {
                    room.foldersByMeCount = count.count;
                })
            });


            $rootScope.$on('createFolder', function(event, data) {
                var theSubject = _.find($scope.subjects, function(subject) {
                    return subject._id === data.subjectId;
                });
                theSubject.count += 1;
            });

            $rootScope.$on('deleteFolder', function(event, data) {
                var theSubject = _.find($scope.subjects, function(subject) {
                    return subject._id === data.subjectId;
                });
                theSubject.count -= 1;
            });


            $rootScope.$on('addFoldersToRoom', function(event, data) {
                var theRoom = _.find($scope.myRooms, function(room) {
                    return room._id === data.roomId;
                });
                theRoom.foldersByMeCount += data.num;
            });

            $rootScope.$on('removeFolderFromRoom', function(event, data) {
                var theRoom = _.find($scope.myRooms, function(room) {
                    return room._id === data.roomId;
                });
                theRoom.foldersByMeCount  -= 1;
            });

            //$scope.selectedSubject = $scope.mySubjects[0];


            $scope.addSubject = function(subject) {
            TeacherDataProvider.addSubject($scope.me._id, subject._id)
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
                        TeacherDataProvider.removeSubject($scope.me._id, subject._id)
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
                //$scope.label = '阳光书包';
                $state.go('sunpack.subject', {subjectId: subjectId});
            };
            $scope.selectRoom = function (roomId) {
                //$scope.label = '我的班级';
                $state.go('sunpack.myroom', {roomId: roomId});
            };
            $scope.gotoRepo2 = function() {
                $state.go('sunpack.repo')
            };
            $scope.gotoRepo = function(selectedSubject, selectedSemester) {
                if(selectedSubject && selectedSemester) {
                    $state.go('sunpack.repo.subject.semester', {subjectId: selectedSubject, semesterId: selectedSemester})
                }else if(selectedSubject) {
                    $state.go('sunpack.repo.subject', {subjectId: selectedSubject});
                }else {
                    $state.go('sunpack.repo');
                }
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

        }
    ]
);