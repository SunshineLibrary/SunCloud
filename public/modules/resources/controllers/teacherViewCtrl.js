angular.module('resources')
    .controller('teacherViewController',
    ['TeacherDataProvider', '$scope', 'AuthService', 'RoomDataProvider', '$location', '$stateParams', 'teacher',
        function (TeacherDataProvider, $scope, AuthService, RoomDataProvider, $location, $stateParams, teacher) {
            $scope.teacher = teacher;
            $scope.isAdmin = $scope.teacher.roles.indexOf('admin') > -1;
            $scope.temp = {};

            RoomDataProvider.getRoomsByTeacher(teacher._id).then(function(rooms) {
                $scope.rooms = rooms;
            });

            $scope.resetPassword = function() {
                swal({
                        title: "重置密码",
                        text: teacher.name + "的密码将被重置为原始密码 xiaoshu",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: false },
                    function(){
                        TeacherDataProvider.resetPassword(teacher._id)
                            .success(function(){
                                swal({title: "重置密码成功", type: "success", timer: 1000 });
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "重置失败", text: "请重试", type: 'error'})
                            })
                    });


            };

            $scope.showEditTeacherDialog = function() {
                $('#editTeacherDialog').modal('show');
                $scope.temp.newName = $scope.teacher.name;
                $scope.temp.newUsername = $scope.teacher.username;
                $scope.temp.newPhone = $scope.teacher.phone;
                $scope.temp.newEmail = $scope.teacher.email;
                $scope.temp.isAdmin = _.contains($scope.teacher.roles, 'admin');
            };
            $scope.editTeacher = function(row) {
                var info = {};
                info._id = $scope.teacher._id;
                info.name = $scope.temp.newName;
                info.username = $scope.temp.newUsername;
                info.phone = $scope.temp.newPhone;
                info.email = $scope.temp.newEmail;
                if($scope.temp.isAdmin) {
                    info.roles = ['admin', 'teacher'];
                }else{
                    info.roles = ['teacher'];
                }
                TeacherDataProvider.editTeacher(info)
                    .success(function(editedTeacher) {
                        $scope.teacher.name = editedTeacher.name;
                        $scope.teacher.username = editedTeacher.username;
                        $scope.teacher.phone = editedTeacher.phone;
                        $scope.teacher.email = editedTeacher.email;
                        $scope.teacher.roles = editedTeacher.roles;
                        $('#editTeacherDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            };

        }
    ]
);