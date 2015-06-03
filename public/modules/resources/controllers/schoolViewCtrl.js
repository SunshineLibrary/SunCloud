angular.module('resources')
    .controller('schoolViewController',
    [
        'school',
        'schoolRooms',
        'admins',
        'RoomDataProvider',
        'TeacherDataProvider',
        '$scope',
        '$state',
        '$stateParams',
        '$location',
        'AuthService', function (
        school, schoolRooms, admins, RoomDataProvider, TeacherDataProvider,$scope, $state, $stateParams, $location, AuthService) {
        $scope.school = school;
        $scope.rooms = schoolRooms;
        $scope.admins = admins;
        $scope.tempRoom = {};
        $scope.editRoom = {};
        $scope.editAdmin = {};
        $scope.newAdmin = {};
        $scope.selectedTeachers = [];
        $scope.filterOptions3 = {filterText: ''};

        var me = AuthService.me;
        $scope.isRootOrAdmin = me.roles.indexOf('root') > -1 || (me.roles.indexOf('admin') > -1 && me.school.toString() === school._id.toString()) ;

        console.log(admins, '~~~~');
        //console.log(me);

        $scope.createRoom = function() {
            if ($scope.tempRoom.name.length > 15) {
                $scope.errorMessage = '班级名不能超过15个字符';
                return;
            }
            var rooms = $scope.rooms;
            for (var roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
                if (rooms[roomIndex].name == $scope.tempRoom.name.trim()) {
                    $scope.tempRoom.nameError = true;
                    return;
                }
                if ($scope.tempRoom.code && rooms[roomIndex].code == $scope.tempRoom.code) {
                    $scope.tempRoom.codeError = true;
                    return;
                }
            }
            var info = {};
            info.name = $scope.tempRoom.name;
            info.code = $scope.tempRoom.code;
            info.school = school._id;
            RoomDataProvider.createAdminRoom(info)
                .success(function(tempRoom) {
                    $scope.rooms.push(tempRoom);
                    $scope.tempRoom = {};
                    $('#createRoomDialog').modal('hide');
                    sweetAlert({title: "创建班级成功", type: "success", timer: 1000 });
                    $location.path('/rooms/' + tempRoom._id);
                })
                .error(function(err){
                    console.log(err);
                    var message = err.errors.name.message || "创建失败，请重试";
                    sweetAlert({title: "创建失败", text: message, type: "error", timer: 2000 });
                });
        };

        $scope.showEditRoomDialog = function(event, row) {
            event.stopPropagation();
            $scope.row = row;
            $scope.tempRoom.newname = row.entity.name;
            $scope.tempRoom.newcode = row.entity.code;
            $('#editRoomDialog').modal('show');
        };

        $scope.editRoom = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.tempRoom.newname;
            info.code = $scope.tempRoom.newcode;
            var rooms = $scope.rooms;
            for (var roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
                if(roomIndex !== rooms.indexOf(row.entity)) {
                    if (rooms[roomIndex].name === $scope.tempRoom.newname.trim()) {
                        $scope.editRoom.nameError = true;
                        return;
                    }
                    if($scope.tempRoom.newcode) {
                        if (rooms[roomIndex].code === $scope.tempRoom.newcode.trim()) {
                            $scope.editRoom.codeError = true;
                            return;
                        }
                    }
                }
            }
            RoomDataProvider.editRoomNameAndCode(info)
                .success(function(editedRoom) {
                    $scope.row.entity.name = editedRoom.name;
                    $scope.row.entity.code = editedRoom.code;
                    $('#editRoomDialog').modal('hide');
                    sweetAlert({title: "修改成功", type: "success", timer: 1000 });
                    $scope.editRoom.codeError = false;
                    $scope.editRoom.codeError = false;
                    $scope.tempRoom = {};
                })
                .error(function(err) {
                    console.error(err);
                    $scope.error = true;
                    sweetAlert({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };

        $scope.showEditAdminDialog = function(event, row) {
            event.stopPropagation();
            $scope.row = row;
            $scope.editAdmin.newName = row.entity.name;
            $scope.editAdmin.newUsername = row.entity.username;
            $scope.editAdmin.newPhone = row.entity.phone;
            $scope.editAdmin.newEmail = row.entity.email;
            $('#editAdminDialog').modal('show');
        };

        $scope.editAdmin = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.editAdmin.newName;
            info.username = $scope.editAdmin.newUsername;
            info.phone = $scope.editAdmin.newPhone;
            info.email = $scope.editAdmin.newEmail;
            TeacherDataProvider.editTeacher(info)
                .success(function(editedTeacher) {
                    $scope.row.entity.name = editedTeacher.name;
                    $scope.row.entity.username = editedTeacher.username;
                    $scope.row.entity.phone = editedTeacher.phone;
                    $scope.row.entity.email = editedTeacher.email;
                    $('#editAdminDialog').modal('hide');
                    sweetAlert({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    $scope.error = true;
                    sweetAlert({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };


        $scope.deleteRoom = function (event, row) {
            event.stopPropagation();
            sweetAlert({
                    title: "您确定要删除"+row.entity.name+"吗?",
                    text: "删除之后，该班级信息将无法找回",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false },
                function(){
                    RoomDataProvider.deleteRoom(row.entity._id)
                        .success(function(room){
                            sweetAlert({title: "删除成功", type: "success", timer: 1000 });
                            $scope.rooms.splice($scope.rooms.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            sweetAlert({title: "删除失败", text: "", type: 'error'})
                        })
                });
        };


        $scope.removeAdminFromSchool = function (event, row) {
            event.stopPropagation();
            sweetAlert({
                    title: "取消超级管理员资格",
                    text: "您确定要将取消"+row.entity.name+"的超级管理员资格吗?",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "关闭",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false },
                function(){
                    var roles = _.without(row.entity.roles, 'admin');
                    TeacherDataProvider.editTeacherRole(row.entity._id, roles)
                        .success(function(teacher){
                            sweetAlert({title: "取消成功", type: "success", timer: 1000 });
                            $scope.admins.splice($scope.admins.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            sweetAlert({title: "取消失败", text: "请重试", type: 'error', timer: 2000});
                        })
                });
        };

        var getTeachersNotAdmin = function() {
            TeacherDataProvider.getTeachersBySchool(school._id).then(function(teachers) {
                $scope.notAdmins = _.filter(teachers, function(teacher) {
                    return teacher.roles.indexOf('admin') === -1;
                })
            })
        };

        $scope.toAddAdmins = function() {
            getTeachersNotAdmin();
            $('#addAdminsDialog').modal('show');
        };

        $scope.addAdmins = function() {
            //$scope.selectedTeachers
            async.each($scope.selectedTeachers, function(teacher, callback) {
                TeacherDataProvider.editTeacherRole(teacher._id, ['teacher', 'admin'])
                    .success(function(teacher) {
                        callback(null);
                        $scope.admins.push(teacher);
                    })
                    .error(function(err) {
                        callback(err);
                    })

            }, function(err){
                if(err) {
                    sweetAlert({title: '添加管理员失败，请重试', type: 'error', timer: 1500});
                }else {
                    sweetAlert({title: '添加管理员成功', type: 'success', timer: 1500});
                    $('#addAdminsDialog').modal('hide');
                }

            })
        };

        $scope.gridOptions1 =
        {
            data: 'rooms',
            multiSelect: false,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '班级名'},
                {field: 'code', displayName: '班级编号', cellTemplate: '<div ng-show="row.entity.code">{{row.entity.code}}</div><div ng-hide="row.entity.code"><span class="label label-default">暂无</span></div>'},
                {field: 'students.length', displayName: '学生数'},
                {field: 'teachers.length', displayName: '老师数'},
                {field: '', displayName: '编辑', visible: $scope.isRootOrAdmin,cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditRoomDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross text-danger" ng-click="deleteRoom($event, row)"></a></div>'}
            ],
            selectedItems: []
        };

        $scope.gridOptions2 =
        {
            data: 'admins',
            enableColumnResize: true,
            multiSelect: false,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'},
                {field: 'phone', displayName: '电话'},
                {field: 'email', displayName: '邮箱'},
                {field: '', displayName: '编辑', visible: $scope.isRootOrAdmin,cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditAdminDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross-circle text-danger" ng-click="removeAdminFromSchool($event, row)"></a></div>'}
            ],
            selectedItems: []
        };
        $scope.gridOptions3 =
        {
            data: 'notAdmins',
            multiSelect: true,
            showSelectionCheckbox: true,
            checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
            //checkboxCellTemplate: '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>',
            //checkboxHeaderTemplate:'<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'name', displayName: '姓名'},
                {field: 'username', displayName: '用户名'}
            ],
            selectedItems: $scope.selectedTeachers,
            filterOptions: $scope.filterOptions3
        };


        $scope.toCreateAdmin = function() {
            $scope.isCreatingAdmin = true;
        };
        $scope.createAdmin = function() {
            var info = {};
            info.name = $scope.newAdmin.name;
            info.username = $scope.newAdmin.username;
            info.school = $stateParams.schoolId;
            info.roles = ['admin', 'teacher'];
            TeacherDataProvider.createTeacher(info)
                .success(function(newAdmin) {
                    $scope.newAdmin = null;
                    sweetAlert({title: "创建成功", type: 'success', timer: 1000});
                    $('body').addClass('modal-open');
                    $scope.notAdmins.push(newAdmin);
                    $scope.selectedTeachers.push(newAdmin);
                    $scope.isCreatingAdmin = false;
                })
                .error(function(err) {
                    console.error(err);
                    if(err.code === 11000) {
                        var message = "用户名已存在，请修改后重试"
                    }
                    sweetAlert({title: "创建失败", text: message, type: 'error', timer: 2000});
                }
            );
        };
        $scope.cancelCreateAdmin = function() {
            $scope.isCreatingAdmin = false;
        };
        $scope.selectRoom = function () {
            $location.path('/rooms/' + $scope.gridOptions1.selectedItems[0]._id)
        };

        $scope.selectAdmin = function () {
            $location.path('/teachers/' + $scope.gridOptions2.selectedItems[0]._id)
        };

        // Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });

    }
    ]);
