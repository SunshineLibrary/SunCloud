angular.module('sunpack')
    .controller('repoSubjectController',
    ['sharedFiles', 'sharedFolders', '$scope', 'SubjectDataProvider', 'FolderDataProvider', 'SemesterDataProvider','$stateParams', 'subject', '$state',
        function (sharedFiles, sharedFolders, $scope, SubjectDataProvider, FolderDataProvider, SemesterDataProvider, $stateParams, subject, $state) {
            $scope.subject = subject;
            $scope.newFolder = {};
            $scope.sharedFiles = sharedFiles;
            $scope.sharedFolders = sharedFolders;
            $scope.temp = {};
            $scope.showingFiles = true;
            console.log(sharedFiles);
            //var me = AuthService.me;

            //FolderDataProvider.getFoldersByTeacherAndSubject(me._id, subject._id).then(function(folders) {
            //    $scope.folders = folders;
            //});
            $scope.showFiles = function() {
                $scope.showingFiles = true;
            };
            $scope.showFolders = function() {
                $scope.showingFiles = false;
            };

            //SemesterDataProvider.getAllSemesters().then(function(semesters) {
            //    $scope.semesters = semesters;
            //});

            $scope.gridOptions1 =
            {
                data: 'sharedFiles',
                multiSelect: false,
                enableColumnResize: true,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'type', displayName: '类型', width: '8%',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
                    {field: 'originalname', displayName: '文件名称', width: '35%', cellTemplate: '<div><a ng-click="selectFile(row.entity._id)">{{row.entity.originalname}}</a></div>'},
                    {field: 'semester.name', displayName: '适用年级'},
                    {field: 'description', displayName: '描述', cellTemplate: '<div ng-show="row.entity.description">' +
                    '<a title="文件描述:{{row.entity.description}}" id="info-tooltip" data-placement="right" data-toggle="tooltip"  type="button"><i class="glyphicon glyphicon-info-sign text-success" ng-mouseover="tooltip()"></i></a>'+
                    ' {{row.entity.description}}</div><div ng-hide="row.entity.description"><span class="label label-default">暂无</span></div>'},
                    {field: 'users.length', displayName: '使用人数', width: '10%'},
                    {field: 'size', displayName: '文件大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field] | fileSizeFilter }} </div>'},
                    {field: '', displayName: '编辑', width: '10%',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="fui-new text-success" ng-click="showEditFileDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="fui-cross text-danger" ng-click="deleteFile($event,row)"></a>' +
                    '&nbsp;&nbsp;<a ng-href="/download/files/{{row.entity._id}}" class="glyphicon glyphicon-download-alt text-primary"></a></div>'}
                ],
                selectedItems: []
            };

            $scope.gridOptions2 =
            {
                data: 'sharedFolders',
                multiSelect: false,
                enableColumnResize: true,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '文件夹名', cellTemplate: '<div><a>{{row.entity.name}}</a></div>'},
                    {field: 'files.length', displayName: '文件个数', width: '10%'},
                    {field: 'semester.name', displayName: '年级'},
                    {field: 'created_at', displayName: '创建时间'},
                    {field: 'updated_at', displayName: '更新时间'},
                    //{field: 'rooms', displayName: '分配班级'},
                    {field: '', displayName: '编辑', width: '10%',cellTemplate:
                    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                    '<a class="fui-new text-success" ng-click="showEditFolderDialog($event, row)"></a> &nbsp;&nbsp;' +
                    '<a class="fui-cross text-danger" ng-click="deleteFolder($event,row)"></a></div>'}
                ],
                selectedItems: []
            };

            $scope.selectFile = function () {
                $state.go('sunpack.repo.subject', {folderId: $scope.gridOptions.selectedItems[0]._id});
                //$location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
            };
            $scope.goto = function(semesterId) {
                console.log(semesterId);
                $state.go('sunpack.repo.subject.semester', {subjectId: subject._id,semesterId: semesterId});
            };
            //
            //
            //$scope.selectFolder = function () {
            //    $state.go('sunpack.subject.folder', {folderId: $scope.gridOptions.selectedItems[0]._id});
            //    //$location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
            //};
            //$('[data-toggle="tooltip"]').tooltip();
            //$('[data-toggle="popover"]').popover();
            //
            //$('[data-toggle="checkbox"]').radiocheck();
            //
            //
            //// Focus state for append/prepend inputs
            //$('.input-group').on('focus', '.form-control', function () {
            //    $(this).closest('.input-group, .form-group').addClass('focus');
            //}).on('blur', '.form-control', function () {
            //    $(this).closest('.input-group, .form-group').removeClass('focus');
            //});

        }
    ]
);