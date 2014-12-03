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
        $scope.filterOptions3 = {filterText: ''};
        $scope.selectedStudents = [];
        $scope.selectedStudents3 = [];
        $scope.selectednow = [];
        $scope.selecteddb = [];
        $scope.dupList = [];
        $scope.students = theRoom.students;
        $scope.temp = {};

        var failList = [];
        var waitingList = [];
        var me = AuthService.me;
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
                console.log(record);
                if(record.length){
                    student.tabletId = record[0].tabletId._id;
                    student.tablet = record[0].tabletId.machine_id;
                    student.loginTime = record[0].loginTime;
                }else{
                    $scope.noTabletNum++;
                }
            });
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
            $('#addStudentsDialog').modal('show');
        };
        $scope.toAddStudentsFromOtherRoom = function() {
            getOtherRooms();
            $scope.gridOptions3.selectAll(false);
            //console.log($scope.gridOptions3.selectedItems);
            //console.log($scope.selectedStudents3);
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

        var getOtherRooms = function() {
            allRoomsPromise.then(function(rooms) {
                getMyTeachingRoomsPromise.then(function(myRooms) {
                    var allRooms = rooms.concat(myRooms);
                    //$scope.otherRooms = _.without(allRooms, _.findWhere(allRooms, {_id: myRooms._id}));
                    $scope.otherRooms = _.filter(allRooms, function(room) {
                        return room._id !== theRoom._id;
                    });
                    //$scope.otherRooms.splice();
                    var studentIds = _.map($scope.students, function(student) {return student._id});
                    $scope.studentsOfOtherRoom = _.filter($scope.otherRooms[0].students, function(student) {
                        return studentIds.indexOf(student._id) === -1;
                    });
                })
            });
        };

        $scope.getStudentsOfRoom = function(roomId) {
            var otherRoom = _.find($scope.otherRooms, function(room) {
                return room._id === roomId;
            });
            var studentIds = _.map($scope.students, function(student) {return student._id});
            $scope.studentsOfOtherRoom = _.filter(otherRoom.students, function(student) {
                return studentIds.indexOf(student._id) === -1;
            });
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
            console.log($scope.gridOptions3.selectedItems);
            console.log($scope.selectedStudents3);
            if($scope.gridOptions3.selectedItems.length) {
                //var oriIds = _.map($scope.students, function(student) {return student._id});
                $scope.gridOptions3.selectedItems = _.uniq($scope.gridOptions3.selectedItems, '_id');
                var newIds = _.map($scope.gridOptions3.selectedItems, function(student) {return student._id});
                console.log(newIds);
                RoomDataProvider.addStudentsToRoom($scope.theRoom._id, newIds)
                    .success(function(room) {
                        console.log('success');
                        console.log($scope.gridOptions3.selectedItems);
                        $('#addStudentsFromOtherRoomDialog').modal('hide');
                        _.each($scope.gridOptions3.selectedItems, function(student) {
                            updateTablet(student);
                        });
                        $scope.students = $scope.students.concat($scope.gridOptions3.selectedItems);
                        $scope.gridOptions3.selectAll(false);
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
                            $scope.students = _.filter($scope.students, function(student) {
                                return student._id !== row.entity._id;
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
            $scope.student.newName = row.entity.name;
            $scope.student.newUsername = row.entity.username;
        };

        $scope.editStudent = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.student.newName;
            info.username = $scope.student.newUsername;
            StudentDataProvider.editStudent(info)
                .success(function(editedStudent) {
                    $scope.row.entity.name = editedStudent.name;
                    $scope.row.entity.username = editedStudent.username;
                    $('#editStudentDialog').modal('hide');
                    swal({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    $scope.editStudentError = true;
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
                RoomDataProvider.addStudentsToRoom($scope.theRoom._id, newIds)
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
                RoomDataProvider.addStudentsToRoom($scope.theRoom._id, newIds)
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
                        allStudentsPromise.then(function(allStudents) {
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
                {field: 'tablet', displayName: '正在使用的晓书',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a ng-show="row.entity.tablet" href="/#/tablets/{{row.entity.tabletId}}">{{row.getProperty(col.field)}}</a><span ng-hide="row.entity.tablet" class="label label-default">暂无</span></div>'},
                {field: 'loginTime', displayName: '上次登录时间'},
                {field: '', displayName: '操作', cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()"  ng-show="showedit">' +
                '<a class="glyphicon glyphicon-edit text-primary" ng-click="showEditStudentDialog(row)"></a> &nbsp;&nbsp;' +
                '<a class="glyphicon glyphicon-remove text-primary" ng-click="removeStudentFromRoom(row)"></a></div>'},
                {field: 'tablet', displayName: '',
                    cellTemplate:'<button type="button" style="align-items: center" class="btn btn-default btn-sm" ng-click="logout(row)" ng-show="row.entity.tablet"><span class="glyphicon glyphicon-log-out"></span> 登出晓书</button>'}
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
        $scope.gridOptions3 =
        {
            data: 'studentsOfOtherRoom',
            multiSelect: true,
            showSelectionCheckbox: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /> &nbsp;</div>',
            columnDefs: [
                {field: 'name', displayName: '姓名', width:'50%'},
                {field: 'username', displayName: '用户名', width: '50%'}
            ],
            selectedItems: $scope.selectedStudents3,
            filterOptions: $scope.filterOptions3
        };
    }
]);
