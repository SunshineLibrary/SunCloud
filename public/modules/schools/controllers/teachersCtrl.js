angular.module('schools')
    .controller('teachersRootController',
    ['teachers', 'TeacherDataProvider', 'RootDataProvider','$scope', '$location',
        function (teachers, TeacherDataProvider, RootDataProvider, $scope, $location) {
            $scope.teachers = teachers;
            $scope.teachersView = teachers;
            $scope.selectedTeacher = [];
            $scope.temp = {};

            $scope.filterOptions = {
                filterText: ''
            };
            RootDataProvider.getAllSchools().then(function(schools) {
                $scope.schools = schools;
            });

            $scope.gridOptions =
            {
                data: 'teachersView',
                multiSelect: false,
                filterOptions: $scope.filterOptions,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '姓名'},
                    {field: 'username', displayName: '用户名'},
                    {field: 'school.name', displayName: '学校'},
                    {field: 'roles', displayName: '管理员', cellTemplate: '<div>{{row.entity.roles | isAdminFilter}}</div>'},
                    {field: 'email', displayName: '邮箱'},
                    {field: 'phone', displayName: '电话'},
                    {field: '', displayName: '编辑', cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="fui-new text-success" ng-click="showEditTeacherDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="fui-cross text-danger" ng-click="deleteTeacher($event,row)"></a></div>'}

                    //{field: 'grade', displayName: '年级', width: 50}
                    //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
                ],
                selectedItems: $scope.selectedTeacher
            };

            $scope.allTeachers = function() {
                $scope.teachersView = $scope.teachers;
            };
            $scope.onlyAdmins = function() {
                $scope.teachersView = _.filter($scope.teachers, function(teacher) {
                    return teacher.roles.indexOf('admin') > -1;
                });
                console.log($scope.teachersView);
            };
            $scope.createTeacher = function() {
                var info = {};
                info.name = $scope.newTeacher.name;
                info.username = $scope.newTeacher.username;
                info.school = $scope.newTeacher.school._id;
                info.phone = $scope.newTeacher.phone;
                info.email = $scope.newTeacher.email;
                info.roles = $scope.newTeacher.isAdmin ? ['admin','teacher'] : ['teacher'];
                info.password = 'xiaoshu';
                TeacherDataProvider.createTeacher(info)
                    .success(function(teacher){
                        console.log(teacher);
                        teacher.school = $scope.newTeacher.school;
                        $scope.teachers.push(teacher);
                        $scope.newTeacher = null;
                        $('#createTeacherDialog').modal('hide');
                        swal({
                            title: "创建成功",
                            text: "此用户名可登录晓书教师账号和教师平台\n教师平台默认密码为xiaoshu",
                            type: "success",
                            confirmButtonColor: "#2E8B57",
                            confirmButtonText: "确定",
                            closeOnConfirm: false })
                    }).error(function(err){
                        console.error(err);
                        if(err.code === 11000) {
                            $scope.errorMessage = "用户名已存在，请修改后重试"
                        }
                        swal({title: "创建失败", text: $scope.errorMessage, type: 'error'});
                    });
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

            $scope.showEditTeacherDialog = function(event, row) {
                event.stopPropagation();
                $('#editTeacherDialog').modal('show');
                $scope.row = row;
                $scope.temp.newName = row.entity.name;
                $scope.temp.newUsername = row.entity.username;
                $scope.temp.newSchool = _.find($scope.schools, function(school) {
                    return school._id === row.entity.school._id
                });
                $scope.temp.newPhone = row.entity.phone;
                $scope.temp.newEmail = row.entity.email;
            };
            $scope.editTeacher = function(row) {
                var info = {};
                info._id = row.entity._id;
                info.name = $scope.temp.newName;
                info.username = $scope.temp.newUsername;
                info.school = $scope.temp.newSchool;
                info.phone = $scope.temp.newPhone;
                info.email = $scope.temp.newEmail;
                TeacherDataProvider.editTeacher(info)
                    .success(function(editedTeacher) {
                        $scope.row.entity.name = editedTeacher.name;
                        $scope.row.entity.username = editedTeacher.username;
                        $scope.row.entity.school = info.school;
                        $scope.row.entity.phone = editedTeacher.phone;
                        $scope.row.entity.email = editedTeacher.email;
                        $('#editTeacherDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            };

            $scope.selectTeacher = function () {
                $location.path('/teachers/' + $scope.gridOptions.selectedItems[0]._id);
            };


            // Focus state for append/prepend inputs
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.input-group, .form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.input-group, .form-group').removeClass('focus');
            });
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



        }]).filter('isAdminFilter', function() {
        return function(roles) {
            return roles.indexOf('admin') > -1 ? '是' : '否';
        };
    });
