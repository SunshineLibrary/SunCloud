angular.module('schoolManage')
    .controller('teachersController',
    ['teachers', 'TeacherDataProvider', '$scope', 'AuthService', '$location',
        function (teachers, TeacherDataProvider, $scope, AuthService, $location) {
            $scope.teachers = teachers;
            var me = AuthService.me;
            console.log(me);
            $scope.temp = {};
            $scope.temp.error = false;
            $scope.selectedTeacher = [];
            $scope.newTeacher = {};
            $scope.newTeacher.isAdmin = false;
            $scope.filterOptions = {
                filterText: ''
            };

            $scope.gridOptions =
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
                    {field: 'roles', displayName: '是否为超级管理员', cellTemplate: '<div>{{row.entity[col.field].indexOf(\'admin\') > -1 | isAdminFilter}}</div>'},
                    {field: 'email', displayName: '邮箱'},
                    {field: 'phone', displayName: '电话'},
                    {field: '', displayName: '编辑', cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="glyphicon glyphicon-edit text-success" ng-click="showEditTeacherDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="glyphicon glyphicon-remove text-success" ng-click="deleteTeacher($event, row)"></a></div>'}

                    //{field: 'grade', displayName: '年级', width: 50}
                    //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
                ],
                selectedItems: $scope.selectedTeacher,
                filterOptions: $scope.filterOptions


            };


            $scope.showEditTeacherDialog = function(event, row) {
                event.stopPropagation();
                $('#editTeacherDialog').modal('show');
                $scope.row = row;
                $scope.temp.newName = row.entity.name;
                $scope.temp.newUsername = row.entity.username;
                $scope.temp.newPhone = row.entity.phone;
                $scope.temp.newEmail = row.entity.email;
                $scope.temp.isAdmin = _.contains(row.entity.roles, 'admin');
            };
            $scope.editTeacher = function(row) {
                var info = {};
                info._id = row.entity._id;
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
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            };

            $scope.deleteTeacher = function (event, row) {
                event.stopPropagation();
                swal({
                        title: "您确定要删除老师"+row.entity.name+"吗?",
                        text: "删除之后，该老师信息将无法找回",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "删除",
                        closeOnConfirm: false },
                    function(){
                        TeacherDataProvider.deleteTeacher(row.entity._id)
                            .success(function(teacher){
                                swal({title: "删除成功", type: "success", timer: 1000 });
                                $scope.teachers.splice($scope.teachers.indexOf(row.entity),1);
                            })
                            .error(function(err){
                                console.error(err);
                                swal({title: "删除失败", text: "", type: 'error'})
                            })
                    });
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
                console.log(info.school);
                info.password = 'xiaoshu';
                TeacherDataProvider.createTeacher(info)
                    .success(function(teacher){
                        console.log(teacher);
                        $scope.teachers.push(teacher);
                        $scope.newTeacher = undefined;
                        $('#createTeacherDialog').modal('hide');
                        swal({
                            title: "创建成功",
                            text: "此用户名可登录晓书教师账号和教师平台\n教师平台默认密码为xiaoshu",
                            type: "success",
                            confirmButtonColor: "#2E8B57",
                            confirmButtonText: "确定",
                            closeOnConfirm: false })
                    })
                    .error(function(err){
                        console.error(err);
                        if(err.code === 11000) {
                            $scope.errorMessage = "用户名已存在，请修改后重试"
                        }
                        swal({title: "创建失败", text: $scope.errorMessage, type: 'error'});
                    });
            };



            $scope.selectTeacher = function () {
                //$state.transitionTo(roomView(roomId: $scope.gridOptions.selectedItems[0]._id))
                $location.path('/teachers/' + $scope.gridOptions.selectedItems[0]._id);
            };

        }
    ])
    .filter('isAdminFilter', function() {
    return function(input) {
        return input ? '是' : '否';
    };
});
