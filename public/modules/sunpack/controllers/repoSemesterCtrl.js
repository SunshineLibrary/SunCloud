angular.module('sunpack')
    .controller('repoSemesterController',
    ['sharedFilesOfSemester', 'myFoldersBySubjectAndSemester','$scope', 'SubjectDataProvider', 'FolderDataProvider', 'FileDataProvider','$stateParams', 'semester', '$state', '$sce', 'AuthService',
        function (sharedFilesOfSemester, myFoldersBySubjectAndSemester, $scope, SubjectDataProvider, FolderDataProvider, FileDataProvider, $stateParams, semester, $state, $sce, AuthService) {
            $scope.semester = semester;
            $scope.newFolder = {};
            $scope.sharedFilesOfSemester = sharedFilesOfSemester;
            $scope.myFoldersBySubjectAndSemester = myFoldersBySubjectAndSemester;
            $scope.selectedFolder = $scope.myFoldersBySubjectAndSemester[0] ? $scope.myFoldersBySubjectAndSemester[0]._id : null;
            $scope.filterOptions = {filterText: ''};
            $scope.data = {searchingText: ''};
            $scope.selectedIndex = 0;
            var types =   ['pdf', 'doc', 'ebook', 'video', 'audio', 'image', 'other'];
            $scope.creatingFolder = false;
            var me = AuthService.me;

            $scope.clickLike = function(fileId) {
                if($scope.liked) {
                    $('#likeButton').removeClass('fa-heart-o').addClass('text-danger fa-heart');
                }else {
                    $('#likeButton').removeClass('text-danger fa-heart').addClass('fa-heart-o');
                }
                FileDataProvider.changeFileLike(fileId, me._id, $scope.liked)
                    .success(function(editedFile) {
                        $scope.file.like = editedFile.like;
                        _.findWhere($scope.sharedFilesOfSemester, {_id: fileId}).like = editedFile.like;
                    })
                    .error(function(err) {
                        console.error(err);
                    });
            };

            $scope.$watchGroup(['selectedIndex', 'data.searchingText'], function(newValue) {
                if(newValue) {
                    console.log(newValue[1]);
                    if (newValue[0] === 0) {
                        $scope.filterOptions.filterText = newValue[1];
                    }else {
                        $scope.filterOptions.filterText = 'type:' + types[newValue[0]-1] + ';' + newValue[1];
                    }
                }
            });
            $scope.selectFileType = function(index) {
                $scope.selectedIndex = index;
            };

            $scope.gridOptions1 =
            {
                data: 'sharedFilesOfSemester',
                multiSelect: false,
                enableColumnResize: true,
                rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                'class="ngCell {{col.cellClass}}" ng-cell></div>',
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'type', displayName: '类型', width: '8%',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
                    {field: 'originalname', displayName: '文件名称', width: '35%', cellTemplate: '<div><a ng-click="selectFile(row)">{{row.entity.originalname}}</a></div>'},
                    //{field: 'semester.name', displayName: '适用年级'},
                    {field: 'description', displayName: '描述', cellTemplate: '<div ng-show="row.entity.description">' +
                    '<a title="文件描述:{{row.entity.description}}" id="info-tooltip" data-placement="right" data-toggle="tooltip"  type="button"><i class="glyphicon glyphicon-info-sign text-success" ng-mouseover="tooltip()"></i></a>'+
                    ' {{row.entity.description}}</div><div ng-hide="row.entity.description"><span class="label label-default">无</span></div>'},
                    {field: 'created_at', displayName: '创建时间', cellTemplate: '<div class="label label-primary">{{row.entity.created_at | amDateFormat:\'L a h:mm\'}}</div>'},
                    {field: 'users.length', displayName: '使用人数', width: '10%'},
                    {field: 'size', displayName: '文件大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field] | fileSizeFilter }} </div>'},
                //    {field: '', displayName: '编辑', width: '10%',cellTemplate:
                //    '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                //    '<a class="fui-new text-success" ng-click="showEditFileDialog($event, row)"></a> &nbsp;&nbsp;' +
                //    '<a class="fui-cross text-danger" ng-click="deleteFile($event,row)"></a>' +
                //    '&nbsp;&nbsp;<a ng-href="/download/files/{{row.entity._id}}" class="glyphicon glyphicon-download-alt text-primary"></a></div>'}
                ],
                selectedItems: [],
                filterOptions: $scope.filterOptions

            };

            //$scope.gridOptions2 =
            //{
            //    data: 'sharedFoldersOfSemester',
            //    multiSelect: false,
            //    enableColumnResize: true,
            //    rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            //    'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            //    'class="ngCell {{col.cellClass}}" ng-cell></div>',
            //    columnDefs: [
            //        {field: '_id', visible: false},
            //        {field: 'name', displayName: '文件夹名', cellTemplate: '<div><a>{{row.entity.name}}</a></div>'},
            //        {field: 'files.length', displayName: '文件个数', width: '10%'},
            //        //{field: 'semester.name', displayName: '年级'},
            //        {field: 'created_at', displayName: '创建时间'},
            //        {field: 'updated_at', displayName: '更新时间'},
            //        //{field: 'rooms', displayName: '分配班级'},
            //        {field: '', displayName: '编辑', width: '10%',cellTemplate:
            //        '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
            //        '<a class="fui-new text-success" ng-click="showEditFolderDialog($event, row)"></a> &nbsp;&nbsp;' +
            //        '<a class="fui-cross text-danger" ng-click="deleteFolder($event,row)"></a></div>'}
            //    ],
            //    selectedItems: [],
            //    filterOptions: $scope.filterOptions2
            //
            //};

            $scope.addToFolder = function() {
                FolderDataProvider.addFileToFolder($scope.selectedFolder, $scope.file._id)
                    .success(function(editedFolder) {
                        $('#addToMyFolderDialog').modal('hide');
                        swal({title: '文件已成功添加至您的文件夹', type: 'success', timer: 1500});
                })
                    .error(function(err) {
                        console.error(err);
                        swal({title: '添加文件失败', text: '请重试', type: 'error', timer: 2000});
                    })
            };

            $scope.createFolder = function() {
                var info = {};
                info.name = $scope.newFolderName;
                info.subject = $scope.subject._id;
                info.semester = $scope.semester._id;
                info.owner = me._id;
                info.school = me.school;
                FolderDataProvider.createFolder(info)
                    .success(function(newFolder) {
                        $scope.myFoldersBySubjectAndSemester.push(newFolder);
                        $scope.selectedFolder = $scope.myFoldersBySubjectAndSemester[$scope.myFoldersBySubjectAndSemester.length-1]._id;
                        $scope.creatingFolder = false;
                        $rootScope.$broadcast('createFolder', {subjectId: $scope.subject._id});
                    })
                    .error(function(err) {
                        console.error(err);
                    })

            };
            //
            $scope.selectFile = function (row) {
                $scope.file = null;
                $scope.file = row.entity;
                $scope.liked = $scope.file.like.indexOf(me._id) > -1;
                if($scope.liked) {
                    $('#likeButton').addClass('text-danger fa-heart').removeClass('fa-heart-o');
                }else {
                    $('#likeButton').removeClass('text-danger fa-heart').addClass('fa-heart-o');
                }
                $scope.type = {};
                console.log($scope.file.like);
                var mimetype = $scope.file.mimetype;
                if(mimetype.indexOf('pdf') > -1) {
                    $scope.type.isPDF = true;
                }else if(mimetype.indexOf('video') > -1) {
                    $scope.type.isVideo = true;
                }else if(mimetype.indexOf('audio') > -1) {
                    $scope.type.isAudio = true;
                }else if(mimetype.indexOf('image') > -1) {
                    $scope.type.isImage = true;
                }else if(mimetype.indexOf('text') > -1) {
                    $scope.type.isText = true;
                }else {
                    $scope.type.isOther = true;
                }
                $scope.fileUrl = $sce.trustAsResourceUrl('/sunpack/' + $scope.file._id);
                $scope.videoUrl = $sce.trustAsResourceUrl('/sunpack/' + $scope.file._id);
                console.log($scope.file.mimetype);

                $('#previewFileDialog').modal('show');
                //$state.go('sunpack.repo.subject', {folderId: $scope.gridOptions.selectedItems[0]._id});
                //$location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
            };

            $scope.closePreview = function() {
                $scope.file = null;
                $scope.type = {};
                $('#previewFileDialog').modal('hide');
            };
            $('[data-toggle="tooltip"]').tooltip();
            // Add style class name to a tooltips
            $('.tooltip').addClass(function () {
                if ($(this).prev().attr('data-tooltip-style')) {
                    return 'tooltip-' + $(this).prev().attr('data-tooltip-style');
                }
            });
            //$scope.goto = function(semesterId) {
            //    console.log(semesterId);
            //    $state.go('sunpack.repo.subject.semester', {subjectId: subject._id,semesterId: semesterId});
            //};
            // Focus state for append/prepend inputs
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.input-group, .form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.input-group, .form-group').removeClass('focus');
            });

        }
    ]
);