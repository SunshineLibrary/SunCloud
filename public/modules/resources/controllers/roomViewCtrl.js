angular.module('resources')
    .controller('roomViewController',
    [
        'room',
        'RoomDataProvider',
        'StudentDataProvider',
        'UserDataProvider',
        'TeacherDataProvider',
        'SchoolDataProvider',
        '$scope',
        '$state',
        '$stateParams',
        'AuthService',
        '$location', function (
        room,RoomDataProvider, StudentDataProvider, UserDataProvider, TeacherDataProvider, SchoolDataProvider,$scope, $state, $stateParams,AuthService, $location) {
        var me = AuthService.me;
        $scope.room = room;
        $scope.selectedStudent = [];
        $scope.selectedStudents = [];
        $scope.selectedTeacher = [];
        $scope.selectedTeachers = [];
        $scope.selectednow = [];
        $scope.selecteddb = [];
        $scope.student = {};
        $scope.teacher = {};
        $scope.manualState = true;
        $scope.autoState = false;
        $scope.dupList = [];
        $scope.newStudent = {};
        $scope.newTeacher = {};
        $scope.newCode = '';
        $scope.isCreatingStudent = false;
        $scope.isCreatingTeacher = false;
        $scope.isAddingCode = false;
        $scope.filterOptions = {filterText: ''};
        $scope.filterOptions4 = {filterText: ''};
        $scope.teachers = $scope.room.teachers;
        $scope.students = $scope.room.students;
        $scope.isAdminOrRoot = (_.intersection(me.roles, ['admin', 'root'])).length ? true: false;
        var failList = [];
        var waitingList = [];

        $scope.$watch('room', function (newRoom) {
            if (newRoom) {
                room = newRoom;
                $scope.room = room;
                $scope.roomNewName = room.name;
            }
        }, true);

        $scope.$watch('students', function (newStudents) {
            if (newStudents) {
                newStudents = newStudents.sort(function (a, b) {
                    return a.username.localeCompare(b.username);
                });
                $scope.students = newStudents;
            }
        }, true);

        $scope.$watch('teachers', function (newTeachers) {
            if (newTeachers) {
                newTeachers = newTeachers.sort(function (a, b) {
                    return a.username.localeCompare(b.username);
                });
                $scope.teachers = newTeachers;
            }
        }, true);

        var updateTablet = function(student) {
            UserDataProvider.getTablet(student._id).then(function(record){
                if(record.length){
                    student.tabletId = record[0].tabletId._id;
                    student.tablet = record[0].tabletId.machine_id;
                    student.loginTime = record[0].loginTime;
                }
            });
        };

        _.each($scope.students, function(studentItem) {
            updateTablet(studentItem);
        });

        console.log($scope.students);

        $scope.gridOptions1 =
        {
            data: 'students',
            multiSelect: false,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'},
                {field: 'birthday', displayName: '生日'},
                {field: 'tablet', displayName: '正在使用的晓书',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()" ng-show="row.entity.tablet"><a href="/#/tablets/{{row.entity.tabletId}}">{{row.getProperty(col.field)}}</a></div><div ng-hide="row.entity.tablet"><span class="label label-default">暂无</span></div>'},
                {field: 'gender', displayName: '性别', width: 60},
                {field: 'grade', displayName: '年级', width: 50},
                {field: '', displayName: '编辑', visible: $scope.isAdminOrRoot,cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross-circle text-danger" ng-click="removeStudentFromRoom($event, row)"></a></div>'}
            ],
            selectedItems: $scope.selectedStudent
        };

        $scope.gridOptions2 =
        {
            data: 'studentsNotInRoom',
            multiSelect: true,
            showSelectionCheckbox: true,
            checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /> &nbsp;</div>',
            //checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
            checkboxHeaderTemplate:'<div>&nbsp</div>',
            enableColumnResize : true,
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'}
                //{field: 'grade', displayName: '年级', width: 50}
            ],
            selectedItems: $scope.selectedStudents,
            filterOptions: $scope.filterOptions
        };

        $scope.gridOptions3 =
        {
            data: 'teachers',
            multiSelect: false,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'},
                {field: '', displayName: '编辑', visible: $scope.isAdminOrRoot,cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditTeacherDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross-circle text-danger" ng-click="removeTeacherFromRoom($event, row)"></a></div>'}
            ],
            selectedItems: $scope.selectedTeacher
        };

        $scope.gridOptions4 =
        {
            data: 'teachersNotInRoom',
            multiSelect: true,
            showSelectionCheckbox: true,
            checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
            //checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
            checkboxHeaderTemplate:'<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'}
                ],
            selectedItems: $scope.selectedTeachers,
            filterOptions: $scope.filterOptions4
        };

        $scope.toAddStudents = function() {
            getStudentsNotInRoom();
            $scope.gridOptions2.selectAll(false);
            $('#addStudentsDialog').modal('show');
        };
        $scope.toAddTeachers = function() {
            getTeachersNotInRoom();
            $scope.gridOptions4.selectAll(false);
            $('#addTeachersDialog').modal('show');
        };

        $scope.toAddManual = function() {
            $scope.manualState = true;
            $scope.autoState = false;
        };
        $scope.toAddAuto = function() {
            $scope.manualState = false;
            $scope.autoState = true;
        };

        $scope.toCreateStudent = function() {
            $scope.isCreatingStudent = true;
        };
        $scope.cancelCreateStudent = function() {
            $scope.isCreatingStudent = false;
        };
        $scope.toCreateTeacher = function() {
            $scope.isCreatingTeacher = true;
        };
        $scope.cancelCreateTeacher = function() {
            $scope.isCreatingTeacher = false;
        };
        $scope.toAddCode = function() {
            $scope.isAddingCode = true;
        };
        $scope.cancelAddCode = function() {
            $scope.isAddingCode = false;
        };
        $scope.addCode = function() {
            if(!$scope.newCode.trim().length){
                swal({title: "请输入班级代号", type: "warning", timer: 1500});
            }else{
                RoomDataProvider.editRoomCode(room._id, $scope.newCode)
                    .success(function(newRoom){
                        $scope.room.code = newRoom.code;
                        $scope.isAddingCode = false;
                        swal({title: "添加成功", text: "班级代号为" + newRoom.code, type: "success", timer: 1500});
                    }).error(function(err){
                        console.error(err);
                        swal({title: "添加失败", text: "请重试", type: "error", timer: 2000});
                    })
            }
        };

        $scope.createStudent = function () {
            var info = {};
            info.name = $scope.newStudent.name;
            info.username = $scope.newStudent.username;
            info.school = me.school;
            info.roles = ['student'];
            StudentDataProvider.createStudent(info)
                .success(function(newStudent) {
                    $('#createStudentDialog').modal('hide');
                    $scope.newStudent = null;
                    swal({title: "创建成功", type: 'success', timer: 1000});
                    $('body').addClass('modal-open');
                    $scope.studentsNotInRoom.push(newStudent);
                    $scope.selectedStudents.push(newStudent);
                    $scope.isCreatingStudent = false;
                })
                .error(function(err) {
                    console.error(err);
                    if(err.code === 11000) {
                        var message = "用户名已存在，请修改后重试"
                    }
                    swal({title: "创建失败", text: message, type: 'error', timer: 2000});
                }
            );
        };

        $scope.createTeacher = function () {
            var info = {};
            info.name = $scope.newTeacher.name;
            info.username = $scope.newTeacher.username;
            info.school = me.school;
            info.roles = ['teacher'];
            if($scope.newTeacher.isAdmin) {
                info.roles.push('admin');
            }
            info.password = 'xiaoshu';
            TeacherDataProvider.createTeacher(info)
                .success(function(newTeacher){
                    $scope.newTeacher = undefined;
                    $('#createTeacherDialog').modal('hide');
                    $scope.teachersNotInRoom.push(newTeacher);
                    $scope.selectedTeachers.push(newTeacher);
                    $scope.isCreatingTeacher = false;
                    swal({
                        title: "创建成功",
                        text: "此用户名可登录晓书教师账号和教师平台\n教师平台默认密码为xiaoshu",
                        type: "success",
                        confirmButtonColor: "#2E8B57",
                        confirmButtonText: "确定",
                        closeOnConfirm: false,
                        timer: 3000});
                })
                .error(function(err){
                    console.error(err);
                    if(err.code === 11000) {
                        $scope.errorMessage = "用户名已存在，请修改后重试"
                    }
                    swal({title: "创建失败", text: $scope.errorMessage, type: 'error'});
                });
        };

        var getStudentsNotInRoom = function () {
            StudentDataProvider.getStudentsBySchool(me.school).then(function(students) {
                var allStudents = students;
                var studentIds = _.map($scope.students, function(student) {return student._id});
                $scope.studentsNotInRoom = _.filter(allStudents, function(student) {
                    return studentIds.indexOf(student._id) === -1;
                })
            });
        };

        var getTeachersNotInRoom = function () {
            TeacherDataProvider.getTeachersBySchool(me.school)
                .then(function(teachers) {
                    var allTeachers = teachers;
                    var teacherIds = _.map($scope.teacher, function(teacher) {return teacher._id});
                    $scope.teachersNotInRoom = _.filter(allTeachers, function(teacher) {
                        return teacherIds.indexOf(teacher._id) === -1;
                    })
                })
        };

        $scope.addStudentsToRoom = function() {
            if($scope.selectedStudents.length) {
                //var oriIds = _.map($scope.students, function(student) {return student._id});
                var newIds = _.map($scope.selectedStudents, function(student) {return student._id});
                //var nowIds = _.uniq(oriIds.concat(newIds));
                RoomDataProvider.addStudentsToRoom($scope.room._id, newIds)
                    .success(function(room) {
                        $('#addStudentsDialog').modal('hide');
                        $scope.students = $scope.students.concat($scope.selectedStudents);
                        $scope.gridOptions2.selectAll(false);
                        swal({title: "添加成功", type: "success", timer: 1000})
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", type: "error",timer: 2000});
                    });
            }else {
                swal({title: "您还没有选择任何学生", type: "warning", timer: 2000});
            }
        };

        $scope.addTeachersToRoom = function() {
            if($scope.selectedTeachers.length) {
                //var oriIds = _.map($scope.teachers, function(teacher) {return teacher._id});
                var newIds = _.map($scope.selectedTeachers, function(teacher) {return teacher._id});
                //var nowIds = _.uniq(oriIds.concat(newIds));
                RoomDataProvider.addTeachersToRoom($scope.room._id, newIds)
                    .success( function(room) {
                        $('#addTeachersDialog').modal('hide');
                        $scope.teachers = $scope.teachers.concat($scope.selectedTeachers);
                        $scope.gridOptions4.selectAll(false);
                        swal({title: "添加成功", type: "success", timer: 1000})
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", timer: 2000});
                    });
            }else {
                swal({title: "您还没有选择任何老师", type: "warning", timer: 2000});
            }

        };

        $scope.removeStudentFromRoom = function (event, row) {
            event.stopPropagation();
            swal({
                    title: "移出班级",
                    text: "您确定要将学生"+row.entity.name+"移出班级吗?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false },
                function(){
                    var oriIds = _.map($scope.students, function(student) {return student._id});
                    var newIds = _.filter(oriIds, function(student) {return student !== row.entity._id });
                    RoomDataProvider.removeStudentFromRoom($scope.room._id, row.entity._id)
                        .success(function(student){
                            swal({title: "移出成功", type: "success", timer: 1000 });
                            $scope.students.splice($scope.students.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            swal({title: "移出失败", text: "请重试", type: 'error', timer: 2000})
                        })
                });
        };

        $scope.removeTeacherFromRoom = function (event, row) {
            event.stopPropagation();
            swal({
                    title: "移出班级",
                    text: "您确定要将老师"+row.entity.name+"移出班级吗?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.removeTeacherFromRoom($scope.room._id, row.entity._id)
                        .success(function(teacher){
                            swal({title: "移出成功", type: "success", timer: 1000 });
                            $scope.teachers.splice($scope.teachers.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            swal({title: "移出失败", text: "请重试", type: 'error', timer: 2000});
                        })
                });
        };

        $scope.showEditStudentDialog = function(event, row) {
            event.stopPropagation();
            $('#editStudentDialog').modal('show');
            $scope.row = row;
            $scope.student.newName = row.entity.name;
            $scope.student.newUsername = row.entity.username;
            $scope.student.newBirthday = row.entity.birthday;
        };
        $scope.editStudent = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.student.newName;
            info.username = $scope.student.newUsername;
            info.birthday = $scope.student.newBirthday;
            StudentDataProvider.editStudentNameBirthday(info)
                .success(function(editedStudent) {
                    $scope.row.entity.name = editedStudent.name;
                    $scope.row.entity.username = editedStudent.username;
                    $scope.row.entity.birthday = editedStudent.birthday;
                    $('#editStudentDialog').modal('hide');
                    swal({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    $scope.editStudentError = true;
                    swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };

        $scope.showEditTeacherDialog = function(event, row) {
            event.stopPropagation();
            $('#editTeacherDialog').modal('show');
            $scope.row = row;
            $scope.teacher.newName = row.entity.name;
            $scope.teacher.newUsername = row.entity.username;
            $scope.teacher.newPhone = row.entity.phone;
            $scope.teacher.newEmail = row.entity.email;
            $scope.teacher.isAdmin = _.contains(row.entity.roles, 'admin');
        };
        $scope.editTeacher = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.teacher.newName;
            info.username = $scope.teacher.newUsername;
            info.phone = $scope.teacher.newPhone;
            info.email = $scope.teacher.newEmail;
            if($scope.teacher.isAdmin) {
                info.roles = ['admin', 'teacher'];
            }else{
                info.roles = ['teacher'];
            }
            TeacherDataProvider.editTeacher(info)
                .success(function(editedTeacher) {
                    $scope.row.entity.name = editedTeacher.name;
                    $scope.row.entity.username = editedTeacher.username;
                    $scope.row.entity.phone = editedTeacher.phone;
                    $scope.row.entity.email = editedTeacher.email;
                    $scope.row.entity.roles = editedTeacher.roles;
                    $('#editTeacherDialog').modal('hide');
                    swal({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    $scope.editTeacherError = true;
                    swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };

        var addStudentsToRoom = function() {
            console.log(waitingList);
            console.log(failList);
            console.log($scope.dupList);
            if(waitingList.length) {
                //var oriIds = _.map($scope.students, function(student) {return student._id});
                var newIds = _.map(waitingList, function(student) {return student._id});
                //var nowIds = _.uniq(oriIds.concat(newIds));
                RoomDataProvider.addStudentsToRoom($scope.room._id, newIds)
                    .success( function(room) {
                        if(failList.length) {
                            swal({title: "部分添加失败", text: "数据库错误，请重试", type: 'warning', timer: 2000});
                            var tempList = "";
                            $scope.errorMessage = true;
                            console.log(failList);
                            _.each(failList, function(student) {
                                tempList = tempList.concat(student.name+","+student.username+"\n");
                            });
                            $scope.newStudentsList = tempList;
                            console.log(tempList);
                        }else {
                            swal({title: "批量创建添加学生成功", type: 'success', timer: 2000});
                            $('#addStudentsBatchDialog').modal('hide');
                            $scope.newStudentsList = null;
                            $scope.errorMessage = false;
                            waitingList = [];
                            failList = [];
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", timer: 2000});
                        waitingList = [];
                        failList = [];
                    });
            }
        };

        var autoAddStudentsToRoom = function() {
            console.log(waitingList);
            console.log(failList);
            if(waitingList.length) {
                //var oriIds = _.map($scope.students, function(student) {return student._id});
                var newIds = _.map(waitingList, function(student) {return student._id});
                //var nowIds = _.uniq(oriIds.concat(newIds));
                RoomDataProvider.addStudentsToRoom($scope.room._id, newIds)
                    .success( function(room) {
                        if(failList.length) {
                            swal({title: "部分添加失败", text: "数据库错误，请重试", type: 'warning', timer: 2000});
                            var tempList = "";
                            $scope.errorMessage = true;
                            console.log(failList);
                            _.each(failList, function(student) {
                                tempList = tempList.concat(student.name+"\n");
                            });
                            $scope.newNamesList = tempList;
                            console.log(tempList);
                        }else {
                            swal({title: "批量创建添加学生成功", type: 'success', timer: 2000});
                            $('#addStudentsBatchDialog').modal('hide');
                            $scope.newStudentsList = null;
                            $scope.errorMessage = false;
                            waitingList = [];
                            failList = [];
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        }
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", timer: 2000});
                        waitingList = [];
                        failList = [];
                    });
            }
        };

        $scope.manualCreateStudents = function () {
            var newStudents = [];
            $scope.newStudentsList = $scope.newStudentsList.trim();
            var lines = $scope.newStudentsList.split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                lines[i] = lines[i].trim().replace(/[,， \s]+/igm, ' ');
                var name = lines[i].split(/[,， \s]/)[0];
                var username = lines[i].split(/[,， \s]/)[1];
                newStudents.push({"name": name, "username": username, "school": me.school, "roles": ['student']});
            }

            function MultipleCreate(studentIndex) {
                function switcher() {
                    console.log(studentIndex);
                    if (studentIndex < newStudents.length - 1) {
                        studentIndex++;
                        MultipleCreate(studentIndex);
                    } else {
                        if($scope.dupList.length) {
                            for(var j = 0; j< $scope.dupList.length; j++) {
                                $scope.selectednow[j] = true;
                                $scope.selecteddb[j] = false;
                            }
                            $('#duplicatesDialog').modal('show');
                        }else {
                            console.log('no duplicates');
                            addStudentsToRoom();
                        }
                    }
                }

                var newStudent = newStudents[studentIndex];
                for (var sIndex = 0; sIndex < $scope.students.length; sIndex++) {
                    var student = $scope.students[sIndex];
                    if (student.username === newStudent.username) {
                        if(student.name === newStudent.name) {
                            console.log(student.name + ' is already in this class. ');
                            return switcher();
                        }else {
                            $scope.dupList.push({db: student, now: newStudent});
                            return switcher();
                        }
                    }
                }

                StudentDataProvider.createStudent(newStudent)
                    .success(function(student) {
                        $scope.students.push(student);
                        waitingList.push(student._id);
                        switcher();
                    }).error(function(err) {
                        var found = false;
                        StudentDataProvider.getStudentsBySchool(me.school).then(function(allStudents) {
                            for (var i = 0; i < allStudents.length; i++) {
                                if (allStudents[i].username === newStudent.username) {
                                    if(allStudents[i].name === newStudent.name) {
                                        $scope.students.push(student);
                                        waitingList.push(allStudents[i]._id);
                                    }else {
                                        $scope.dupList.push({db: allStudents[i], now: newStudent});
                                    }
                                    found = true;
                                    break;
                                }
                            }
                            if(!found) {
                                failList.push(newStudent);
                            }
                            switcher();
                        });
                    });
            }
            MultipleCreate(0);
        };


        $scope.dbOrNow = function(index) {
            $scope.selectednow[index] = $scope.selecteddb[index];
            $scope.selecteddb[index] = ! $scope.selecteddb[index];
        };
        $scope.nowOrDb = function(index) {
            $scope.selecteddb[index] = $scope.selectednow[index];
            $scope.selectednow[index] = ! $scope.selectednow[index];
        };
        $scope.duplicateCreate = function() {
            $('#duplicatesDialog').modal('hide');
            for(var i = 0; i < $scope.dupList.length; i++) {
                if($scope.selectednow[i]) {
                    $scope.dupList[i].now._id =  $scope.dupList[i].db._id;
                    StudentDataProvider.editStudent($scope.dupList[i].now)
                        .success(function(student) {
                            waitingList.push(student._id);
                    }).error(function(err) {
                            console.error(err);
                            failList.push($scope.dupList[i].now);
                        })
                }else {
                    var tempStudent = $scope.dupList[i].db;
                    for (var sIndex = 0; sIndex < $scope.students.length; sIndex++) {
                        var student = $scope.students[sIndex];
                        if (student.username === tempStudent.username) {
                            if(student.name === tempStudent.name) {
                                console.log(student.name + ' is already in this class. ');
                            }else {
                                waitingList.push(tempStudent);
                            }
                        }
                    }
                }
            }
            addStudentsToRoom();
        };

        $scope.autoCreateStudents = function () {
            var newStudents = [];
            $scope.newNamesList = $scope.newNamesList.trim();
            var httpPromise;
            var names = $scope.newNamesList.split('\n');
            if(names.length > 100) {
                $scope.temp.student_count_max = true;
                return;
            }
            if(0 < names.length && names.length <=100) {
                httpPromise = SchoolDataProvider.getSchool(me.school);
            }

            httpPromise.then(function(school) {
                var schoolCode = school.code;
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];
                    var studentNo = (i >= 10) ? '' + i : '0' + i;
                    var username = schoolCode + room.code + studentNo;
                    newStudents.push({"name": name, "username": username, "school": me.school, "roles": ['student']});
                }

                function MultipleCreate(studentIndex) {
                    function switcher() {
                        console.log(studentIndex);
                        if (studentIndex < newStudents.length - 1) {
                            studentIndex++;
                            MultipleCreate(studentIndex);
                        } else {
                            autoAddStudentsToRoom();
                        }
                    }

                    var newStudent = newStudents[studentIndex];
                    console.log(newStudent);

                    StudentDataProvider.createStudent(newStudent)
                        .success(function(student) {
                            $scope.students.push(student);
                            waitingList.push(student._id);
                            switcher();
                        }).error(function(err) {
                            console.log(err);
                            failList.push(newStudent);
                            switcher();
                        });
                }
                MultipleCreate(0);
            });
        };

        $scope.selectStudent = function () {
            $location.path('/students/' + $scope.selectedStudent[0]._id)
        };

        $scope.selectTeacher = function () {
            $location.path('/teachers/' + $scope.selectedTeacher[0]._id)
        };

        $('[data-toggle="checkbox"]').radiocheck();
        // Table: Toggle all checkboxes
        $('.table .toggle-all :checkbox').on('click', function () {
            var $this = $(this);
            var ch = $this.prop('checked');
            $this.closest('.table').find('tbody :checkbox').radiocheck(!ch ? 'uncheck' : 'check');
        });

        // Table: Add class row selected
        $('.table tbody :checkbox').on('change.radiocheck', function () {
            var $this = $(this);
            var check = $this.prop('checked');
            var checkboxes = $this.closest('.table').find('tbody :checkbox');
            var checkAll = checkboxes.length === checkboxes.filter(':checked').length;

            $this.closest('tr')[check ? 'addClass' : 'removeClass']('selected-row');
            $this.closest('.table').find('.toggle-all :checkbox').radiocheck(checkAll ? 'check' : 'uncheck');
        });

    }
]);
