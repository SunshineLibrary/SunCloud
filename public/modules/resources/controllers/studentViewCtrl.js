angular.module('resources')
    .controller('studentViewController',
    ['student','StudentDataProvider', '$scope', 'AuthService', 'UserDataProvider','RoomDataProvider', '$stateParams',
        function (student,StudentDataProvider, $scope, AuthService, UserDataProvider, RoomDataProvider, $stateParams) {
            $scope.student = student;
            $scope.temp = {};
            var me = AuthService.me;
            $scope.isInSameSchool = me.roles.indexOf('root') > -1 || $scope.student.school._id.toString() === me.school.toString();



            RoomDataProvider.getRoomsByStudent($stateParams.studentId).then(function(rooms) {
                $scope.rooms = rooms;
            });

            UserDataProvider.getTablet($stateParams.studentId).then(function(record) {
                if(record.length){
                    $scope.tablet = record[0].tabletId;
                }else{
                    $scope.tablet = null;
                }
            });

            UserDataProvider.getTabletHistory($stateParams.studentId).then(function(history) {
                $scope.xiaoshuHistory = history;

            });


            $scope.showEditStudentDialog = function() {
                $('#editStudentDialog').modal('show');
                $scope.temp.newName = $scope.student.name;
                $scope.temp.newUsername = $scope.student.username;
                $scope.temp.newBirthday = $scope.student.birthday;
            };
            $scope.editStudent = function() {
                var info = {};
                info._id = student._id;
                info.name = $scope.temp.newName;
                info.username = $scope.temp.newUsername;
                info.birthday = $scope.temp.newBirthday;
                StudentDataProvider.editStudentNameBirthday(info)
                    .success(function(editedStudent) {
                        $scope.student.name = editedStudent.name;
                        $scope.student.username = editedStudent.username;
                        $scope.student.birthday = editedStudent.birthday;
                        $('#editStudentDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                        $scope.error = false;
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            };

            // Focus state for append/prepend inputs
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.input-group, .form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.input-group, .form-group').removeClass('focus');
            });








        }
    ]
);