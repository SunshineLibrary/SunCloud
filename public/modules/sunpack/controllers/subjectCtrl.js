angular.module('sunpack')
    .controller('subjectController',
    ['AuthService', '$scope', 'SubjectDataProvider', 'FolderDataProvider', 'SemesterDataProvider','$stateParams', 'subject', '$state',
        function (AuthService, $scope, SubjectDataProvider, FolderDataProvider, SemesterDataProvider, $stateParams, subject, $state) {
            $scope.subject = subject;
            $scope.newFolder = {};
            console.log('subject state');

            var me = AuthService.me;

            FolderDataProvider.getFoldersByTeacherAndSubject(me._id, subject._id).then(function(folders) {
               $scope.folders = folders;
            });

            SemesterDataProvider.getAllSemesters().then(function(semesters) {
                $scope.semesters = semesters;
            });


            $scope.createFolder = function() {
                var info = {};
                info.name = $scope.newFolder.name;
                info.semester = $scope.newFolder.semester;
                info.owner = me._id;
                info.subject = subject._id;
                FolderDataProvider.createFolder(info)
                    .success(function(folder) {
                        console.log(folder);
                        $scope.folders = $scope.folders.concat(folder);
                        $scope.newFolder = undefined;
                        swal({title: '创建文件夹成功', type: 'success', timer: 1500});
                        $('#createFolderDialog').modal('hide');
                    })
                    .error(function(err) {
                        console.error(err);
                        swal({title: '创建文件夹失败', text: '请重试', type: 'error', timer: 2000});

                    })
            };

            $scope.showEditFolderDialog = function(event, row) {

                $('#editFolderDialog').modal('show');
                $scope.temp.newName = $scope.folder.name;
                //$scope.temp.newSemester = $scope.folder.semester;
                $scope.temp.newSemester = _.find($scope.semesters, function(semester) {
                    return semester._id === $scope.folder.semester._id
                });
            };
            $scope.editFolder = function() {
                var info = {};
                info._id = $scope.folder._id;
                info.name = $scope.temp.newName;
                info.semester = $scope.temp.newSemester._id;
                FolderDataProvider.editFolderNameAndSemester(info)
                    .success(function(editedFolder) {
                        $scope.folder.name = editedFolder.name;
                        $scope.folder.semester = $scope.temp.newSemester;
                        $('#editFolderDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            };
            $scope.gridOptions =
            {
                data: 'folders',
                multiSelect: false,
                enableColumnResize: true,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '文件夹名', cellTemplate: '<div><a>{{row.entity.name}}</a></div>'},
                    {field: 'semester', displayName: '年级'},
                    {field: 'created_at', displayName: '创建时间'},
                    {field: 'updated_at', displayName: '更新时间'},
                    {field: 'rooms', displayName: '分配班级'},
                    {field: '', displayName: '编辑', width: '10%',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="fui-new text-success" ng-click="showEditFolderDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="fui-cross text-danger" ng-click="deleteFolder($event,row)"></a></div>'}
                ],
                selectedItems: []
            };


            $scope.selectFolder = function () {
                $state.go('sunpack.subject.folder', {folderId: $scope.gridOptions.selectedItems[0]._id});
                //$location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
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