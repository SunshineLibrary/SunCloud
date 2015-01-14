'use strict';

angular.module('myRooms').controller('myRoomController',
    ['theRoom', '$scope', '$rootScope','$stateParams', '$location', 'Authentication','RoomDataProvider', 'StudentDataProvider', 'UserDataProvider', 'TabletDataProvider','AuthService', '$state',
    function(theRoom, $scope, $rootScope, $stateParams, $location, Authentication, RoomDataProvider, StudentDataProvider,UserDataProvider, TabletDataProvider,AuthService, $state) {
        $scope.authentication = Authentication;
        $scope.theRoom = theRoom;
        $scope.editorEnabled = false;
        $scope.isCreatingStudent = false;
        $scope.isAddingCode = false;
        $scope.filterOptions = {filterText: ''};
        $scope.filterOptions2 = {filterText: ''};
        $scope.selectedStudents = [];
        $scope.selectednow = [];
        $scope.selecteddb = [];
        $scope.dupList = [];
        $scope.students = theRoom.students;
        $scope.temp = {};
        $scope.manualState = true;
        $scope.autoState = false;
        $scope.newStudent = {};
        var me = AuthService.me;
        console.log(me);
        var allRoomsPromise = RoomDataProvider.getAdminRoomsFullBySchool(me.school);
        var getMyTeachingRoomsPromise = RoomDataProvider.getTeachingRoomsFullByTeacher(me._id);
        var allStudentsPromise = StudentDataProvider.getStudentsBySchool(me.school);

        $scope.$watch('theRoom', function (newRoom) {
            if (newRoom) {
                $scope.theRoom = newRoom;
                $scope.newRoomName = newRoom.name;
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

        $scope.theRoom = theRoom;
        $scope.students = $scope.students.sort(function(a, b) {
            if (a.name && b.name) {
                return a.name.localeCompare(b.name);
            }
            return a.username.localeCompare(b.username);
        });

        $scope.noTabletNum = 0;
        var updateTablet = function(student) {
            UserDataProvider.getTablet(student._id).then(function(record){
                if(record.length){
                    student.tabletId = record[0].tabletId._id;
                    student.tablet = record[0].tabletId.machine_id;
                    student.login_at = record[0].login_at;
                    student.update_at = record[0].update_at;
                }else{
                    $scope.noTabletNum++;
                }
            });
        };

        $scope.toAddManual = function() {
            $scope.manualState = true;
            $scope.autoState = false;
        };
        $scope.toAddAuto = function() {
            $scope.manualState = false;
            $scope.autoState = true;
        };
        _.each($scope.students, function(studentItem) {
           updateTablet(studentItem);
        });


        $scope.enableEditor = function() {
            $scope.editorEnabled = true;
            $scope.newRoomName = $scope.theRoom.name;
        };

        $scope.disableEditor = function() {
            $scope.editorEnabled = false;
        };

        $scope.logout = function (row) {
            swal({
                    title: "您确定要将学生"+row.entity.name+"登出晓书吗?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false },
                function(){
                    TabletDataProvider.logout(row.entity._id, row.entity.tabletId)
                        .success(function(record){
                            row.entity.tabletId = null;
                            row.entity.tablet = null;
                            row.entity.loginTime = null;
                            swal({title: "登出成功", type: "success", timer: 1500 });
                        })
                        .error(function(err){
                            console.error(err);
                            swal({title: "登出失败", text: "请重试", type: 'error', timer: 2000})
                        });
                });

        };

        $scope.disclaimRoom = function() {
            swal({
                    title: "您确定要取消认领此班级吗?",
                    text: "取消认领之后，该班级将不会出现在您的班级列表中",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "关闭",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "取消认领",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.removeTeacherFromRoom(theRoom._id, me._id)
                        .success(function(disclaimedRoom) {
                            $rootScope.$broadcast('removeRoom', {id: disclaimedRoom._id});
                            swal({title: "取消认领成功", type: 'success', timer: 1500});
                        }).error(function(err) {
                            console.error(err);
                            swal({title: "取消认领失败", text: "请重试", type: 'error', timer: 1500});
                        })
                });
        };

        $scope.deleteRoom = function() {
            swal({
                    title: "您确定要删除"+$scope.theRoom.name+"吗?",
                    text: "删除之后，该小组所有信息将无法找回",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.deleteRoom(theRoom._id)
                        .success(function(deletedRoom) {
                            $rootScope.$broadcast('removeRoom', {id: deletedRoom._id});
                            swal({title: "删除成功", type: 'success', timer: 1500});
                        }).error(function(err) {
                            console.error(err);
                            swal({title: "删除失败", text: "请重试", type: 'error', timer: 1500});
                        })
                    })
        };

        $scope.save = function() {
            $scope.editorEnabled = false;
            RoomDataProvider.editRoomName(theRoom._id, $scope.newRoomName)
                .success(function(room){
                    $scope.theRoom.name = room.name;
                    $rootScope.$broadcast('roomNameChange', {id: room._id,name: room.name})
                }).error(function(err){
                    console.error(err);
                    swal({title: "修改失败", text: "请重试", type: 'error'})
                })
        };

        $scope.toAddStudents = function() {
            getStudentsNotInRoom();
            $scope.gridOptions2.selectAll(false);
            //$('#addStudentsBatchDialog').modal('hide');
            $('#addStudentsDialog').modal('show');
        };
        $scope.toAddStudentsFromOtherRoom = function() {
            getOtherRooms();
            $('#addStudentsFromOtherRoomDialog').modal('show');
        };
        $scope.toCreateStudent = function() {
            $scope.isCreatingStudent = true;
        };
        $scope.cancelCreateStudent = function() {
            $scope.isCreatingStudent = false;
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
                RoomDataProvider.editRoomCode(theRoom._id, $scope.newCode)
                    .success(function(newRoom){
                        $scope.theRoom.code = newRoom.code;
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
                    $scope.newStudent = null;
                    swal({title: "创建成功", type: 'success', timer: 1000});
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

        $scope.createAddStudent = function () {
            var info = {};
            info.name = $scope.newStudent.name;
            info.username = $scope.newStudent.username;
            info.school = me.school;
            info.roles = ['student'];
            info.birthday = $scope.newStudent.birthday;
            StudentDataProvider.createStudent(info)
                .success(function(newStudent) {
                    $scope.newStudent = null;
                    RoomDataProvider.addStudentsToRoom($scope.theRoom._id, [newStudent._id])
                        .then(function() {
                            $scope.students.push(newStudent);
                            swal({title: "创建并添加学生成功", type: 'success', timer: 1500});
                            $('#createStudentDialog').modal('hide');
                        }, function(err) {
                            console.error(err);
                            $('#createStudentDialog').modal('hide');
                            swal({title: "创建学生成功,添加学生到班级失败", text: '请从所有学生列表中添加', type: 'warning', timer: 1500});
                            $scope.toAddStudents();
                        });
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

        var getOtherRooms = function() {
            allRoomsPromise.then(function(rooms) {
                getMyTeachingRoomsPromise.then(function(myRooms) {
                    var allRooms = rooms.concat(myRooms);
                    $scope.otherRooms = _.reject(allRooms, function(room) {
                        return room._id === theRoom._id;
                    });
                    var studentIds = _.map($scope.students, function(student) {return student._id});
                    _.each($scope.otherRooms, function(otherRoom) {
                        otherRoom.checkall = true;
                       otherRoom.studentsNotInRoom = _.filter(otherRoom.students, function(student) {
                           return studentIds.indexOf(student._id) === -1;
                       });
                        _.each(otherRoom.studentsNotInRoom, function(student) {
                            student.selected = false;
                        });
                    });
                })
            });
        };

        $scope.checkAll = function(room) {
            if(room.checkall) {
                _.each(room.studentsNotInRoom, function(student) {
                    student.selected = true;
                })
            }else {
                _.each(room.studentsNotInRoom, function(student) {
                    student.selected = false;
                })
            }
            room.checkall = !room.checkall;

        };

        var getStudentsNotInRoom = function() {
            allStudentsPromise.then(function(students) {
                var allStudents = students;
                var studentIds = _.map($scope.students, function(student) {return student._id});
                $scope.studentsNotInRoom = _.filter(allStudents, function(student) {
                    return studentIds.indexOf(student._id) === -1;
                })
            });
        };

        $scope.addStudentsToRoom = function() {
            if($scope.selectedStudents.length) {
                //var oriIds = _.map($scope.students, function(student) {return student._id});
                var newIds = _.map($scope.selectedStudents, function(student) {return student._id});
                //var nowIds = _.uniq(oriIds.concat(newIds));
                RoomDataProvider.addStudentsToRoom($scope.theRoom._id, newIds)
                    .success(function(room) {
                        console.log('success');
                        $('#addStudentsDialog').modal('hide');
                        _.each($scope.selectedStudents, function(student) {
                            updateTablet(student);
                        });
                        $scope.students = $scope.students.concat($scope.selectedStudents);
                        $scope.gridOptions2.selectAll(false);
                        $rootScope.$broadcast('changeStudents', {id: $scope.theRoom._id,studentsNum:$scope.students.length});
                        swal({title: "添加成功", type: "success", timer: 1000});
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", type: "error",timer: 2000});
                    });
            }else {
                swal({title: "您还没有选择任何学生", type: "warning", timer: 2000});
            }
        };

        $scope.addStudentsOfOtherRoomToRoom = function() {
            var selectedStudents = [];
            _.each($scope.otherRooms, function(otherRoom) {
                _.each(otherRoom.studentsNotInRoom, function(student) {
                    if(student.selected) {
                        selectedStudents.push(student);
                    }
                })
            });
            selectedStudents = _.uniq(selectedStudents, '_id');
            var selectedStudentsId = _.map(selectedStudents, function(student) {
                return student._id;
            });
            if(selectedStudents.length) {
                RoomDataProvider.addStudentsToRoom($scope.theRoom._id, selectedStudentsId)
                    .success(function(room) {
                        console.log('success');
                        $('#addStudentsFromOtherRoomDialog').modal('hide');
                        _.each(selectedStudents, function(student) {
                            updateTablet(student);
                        });
                        $scope.students = $scope.students.concat(selectedStudents);
                        $rootScope.$broadcast('changeStudents', {id: $scope.theRoom._id,studentsNum:$scope.students.length});
                        swal({title: "添加成功", type: "success", timer: 1500});
                    }).error(function(err) {
                        console.log(err);
                        swal({title: "添加失败", text: "请重试", type: "error",timer: 2000});
                    });
            }else {
                swal({title: "您还没有选择任何学生", type: "warning", timer: 2000});
            }
        };

        $scope.removeStudentFromRoom = function(row) {
            swal({
                    title: "您确定要将"+row.entity.name+"移出班级吗?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.removeStudentFromRoom(theRoom._id, row.entity._id)
                        .success(function(room) {
                            $scope.students = _.reject($scope.students, function(student) {
                                return student._id === row.entity._id;
                            });
                            swal({title: "移出成功", type: 'success', timer: 1500});
                            $rootScope.$broadcast('changeStudents', {id: $scope.theRoom._id,studentsNum:$scope.students.length});
                        }).error(function(err) {
                            console.error(err);
                            swal({title: "移出失败", text: "请重试", type: 'error', timer: 1500});
                        });
                })

        };

        $scope.showEditStudentDialog = function(row) {
            $('#editStudentDialog').modal('show');
            $scope.row = row;
            $scope.temp.newName = row.entity.name;
            $scope.temp.newUsername = row.entity.username;
            $scope.temp.newBirthday = row.entity.birthday;
        };
        $scope.editStudent = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.temp.newName;
            info.username = $scope.temp.newUsername;
            info.birthday = $scope.temp.newBirthday;
            StudentDataProvider.editStudent(info)
                .success(function(editedStudent) {
                    $scope.row.entity.name = editedStudent.name;
                    $scope.row.entity.username = editedStudent.username;
                    $scope.row.entity.birthday = editedStudent.birthday;
                    $('#editStudentDialog').modal('hide');
                    swal({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    $scope.error = true;
                    swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };

        $scope.manualCreateStudents = function() {
            var newStudents = [];
            $scope.newStudentsList = $scope.newStudentsList.trim();
            var lines = $scope.newStudentsList.split(/\n/);
            for (var i = 0; i < lines.length; i++) {
                lines[i] = lines[i].trim().replace(/[,， \s]+/igm, ' ');
                var name = lines[i].split(/[,， \s]/)[0];
                var username = lines[i].split(/[,， \s]/)[1];
                newStudents.push({name: name, username: username});
            }
            StudentDataProvider.manualCreateAddStudents(me.school, $scope.theRoom._id, newStudents)
                .success(function(newStudents) {
                    $scope.newStudentsList = null;
                    swal({title: '批量创建并添加学生成功', type: 'success', timer: 2000});
                    $scope.students = $scope.students.concat(newStudents);
                    $('#addStudentsBatchDialog').modal('hide');
                    $scope.temp.manualCreateError = false;
                })
                .error(function(err, status) {
                    console.log(err);
                    console.error(err);
                    if(status === 406) {
                        var errorList = '';
                        _.each(err, function(e) {
                            errorList = errorList.concat(e.name + ',' + e.username + '\n');
                        });
                        $scope.newStudentsList = errorList;
                        $scope.temp.manualCreateError = true;
                        swal({title: '以下学生创建失败，请重试',text: errorList, type: 'error'});
                    }else if(status === 500) {
                        swal({title: '服务器内部错误', text: '请重试', type: 'error'});
                        $scope.newStudentsList = null;
                        $('#addStudentsBatchDialog').modal('hide');
                    }
                })
        };


        $scope.autoCreateStudents = function() {
            $scope.newNamesList = $scope.newNamesList.trim();
            var names = $scope.newNamesList.split('\n');
            if(names.length > 100) {
                $scope.temp.student_count_max = true;
                return;
            }
            StudentDataProvider.autoCreateAddStudents(me.school, $scope.theRoom._id, names)
                .success(function(newStudents) {
                    $scope.newNamesList = null;
                    swal({title: '批量创建并添加学生成功', type: 'success', timer: 2000});
                    $scope.students = $scope.students.concat(newStudents);
                    $('#addStudentsBatchDialog').modal('hide');
                    $scope.temp.autoCreateError = false;
                })
                .error(function(err, status) {
                    console.error(err);
                    if(status === 406) {
                        var errorList = '';
                        _.each(err, function(e) {
                            errorList = errorList.concat(e + '\n');
                        });
                        $scope.newNamesList = errorList;
                        $scope.temp.autoCreateError = true;
                        swal({title: '批量创建学生失败',text: errorList, type: 'error', timer: 2000});
                    }else if(status === 500) {
                        swal({title: '添加学生到该班级失败', text: '请从学生列表中添加', type: 'error', timer: 1500});
                        $scope.newNamesList = null;
                        $('#addStudentsBatchDialog').modal('hide');
                    }
                })
        };

        $scope.gridOptions =
        {
            data: 'students',
            showFilter: false,
            multiSelect: false,
            filterOptions: $scope.filterOptions,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: 'username', displayName: '用户名', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/#/students/{{row.entity._id}}">{{row.getProperty(col.field)}}</a></div>'},
                {field: 'name', displayName: '姓名'},
                {field: 'birthday', displayName: '生日'},
                {field: 'tablet', displayName: '正在使用的晓书', width: '25%',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a ng-show="row.entity.tablet" href="/#/tablets/{{row.entity.tabletId}}">{{row.getProperty(col.field)}}</a><span ng-hide="row.entity.tablet" class="label label-default">暂无</span></div>'},
                {field: 'lastUpdate', displayName: '上次更新', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.update_at"></span>'},
                {field: '', displayName: '操作', cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()"  ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditStudentDialog(row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross-circle text-danger" ng-click="removeStudentFromRoom(row)"></a></div>'},
                {field: 'tablet', displayName: '',
                    cellTemplate:'<button type="button" style="align-items: center" class="btn btn-danger btn-xs" ng-click="logout(row)" ng-show="row.entity.tablet"><span class="glyphicon glyphicon-log-out"></span> 登出晓书</button>'}
            ]
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
            ],
            selectedItems: $scope.selectedStudents,
            filterOptions: $scope.filterOptions2
        };
        // Focus state for append/prepend inputs
        $('.input-group.edit').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });


    }
]);
