angular.module('repositories')
.controller('repositoriesController',
    ['$scope', 'subjects', 'semesters', 'schools', 'teachers', 'folders', 'files','FolderDataProvider', 'FileDataProvider', 'Authentication', 'FileUploader', '$sce', '$timeout',function($scope, subjects, semesters, schools, teachers, folders, files, FolderDataProvider, FileDataProvider , Authentication, FileUploader, $sce, $timeout) {
        $scope.subjects = subjects;
        $scope.semesters = semesters;
        $scope.schools = schools;
        $scope.teachers = teachers;
        $scope.folders = folders;
        $scope.displayFolders = $scope.folders;
        $scope.files = files;
        $scope.displayFiles = $scope.files;
        $scope.filterOptions = {filterText: ''};
        $scope.filterOptions2 = {filterText: ''};
        $scope.searchText = '';
        $scope.showingFolders = false;
        $scope.data = {fileSource: 0};
        $scope.newFolderName = null;
        $scope.newResource = {};
        $scope.editFile = {};
        $scope.error = {};
        $scope.selectedIndex = 0;
        $scope.selectedSource = 0;
        $scope.selectedTrash = false;
        var me = Authentication.user;
        var subjectIds = _.map($scope.subjects, function(subject) {return subject._id});
        var semesterIds =  _.map($scope.semesters, function(semester) {return semester._id});
        var schoolsIds = _.map($scope.schools, function(school) {return school._id});
        var types =   ['pdf', 'doc', 'ebook', 'video', 'audio', 'image', 'other'];
        var shared = [true, false];
        $scope.allSubjects = [{_id: subjectIds, name: '所有科目'}].concat($scope.subjects);
        $scope.allSemesters = [{_id: semesterIds, name: '所有年级'}].concat($scope.semesters);
        $scope.allSchools =     [{_id: schoolsIds, name: '所有学校'}].concat($scope.schools);

        $scope.selectedSubject = $scope.allSubjects[0]._id;
        $scope.selectedSemester = $scope.allSemesters[0]._id;
        $scope.selectedSchool = $scope.allSchools[0]._id;

        var teacherIds = _.map($scope.teachers, function(teacher) {return teacher._id});
        $scope.allTeachers = [{_id: teacherIds, name: '所有老师'}].concat($scope.teachers);
        $scope.selectedTeacher = $scope.allTeachers[0]._id;
        _.each($scope.files, function(file) {
           file.deleted = file.deleted_at ? true: false;
        });

        $scope.$watchGroup(['selectedIndex', 'selectedSource','searchText'], function(newValue) {
            if(newValue) {
                if(newValue[1] === 3) {
                    $scope.columnDefs = $scope.columnDefs2;
                }else {
                    $scope.columnDefs = $scope.columnDefs1;
                }
                if (newValue[0] === 0 && newValue[1] === 0) {
                    $scope.filterOptions.filterText = newValue[2];
                }else if(newValue[0] === 0){
                    if(newValue[1] ===1) {
                        $scope.filterOptions.filterText = 'shared:true;' + newValue[2];
                    }else if(newValue[1] === 2) {
                        $scope.filterOptions.filterText = 'shared:false;deleted:false' + newValue[2];
                    }else {
                        $scope.filterOptions.filterText = 'shared:false;deleted:true' + newValue[2];
                    }
                }else if(newValue[1] === 0){
                    $scope.filterOptions.filterText = 'type:' + types[newValue[0]-1] + ';' + newValue[2];
                }else {
                    if(newValue[1] ===1) {
                        $scope.filterOptions.filterText = 'shared:true;' + ';type:' + types[newValue[0]-1] + ';' + newValue[2];
                    }else if(newValue[1] === 2) {
                        $scope.filterOptions.filterText = 'shared:false;deleted:false' + ';type:' + types[newValue[0]-1] + ';' + newValue[2];
                    }else {
                        $scope.filterOptions.filterText = 'shared:false;deleted:true' + ';type:' + types[newValue[0]-1] + ';' + newValue[2];
                    }
                    //$scope.filterOptions.filterText = 'shared:' + shared[newValue[1]-1] + ';type:' + types[newValue[0]-1] + ';' + newValue[2];
                }
                //$scope.gridOptions2.columnDefs[11].visible = newValue[1] === 3;
                //console.log($scope.gridOptions2.columnDefs[11] );
            }
        });


        $scope.filter = function(selectedSchool) {
            if(selectedSchool) {
                $scope.theTeachers = _.filter($scope.teachers, function(teacher) {
                    return selectedSchool.indexOf(teacher.school) > -1
                });
                var teacherIds = _.map($scope.theTeachers, function(teacher) {return teacher._id});
                $scope.allTeachers = [{_id: teacherIds, name: '所有老师'}].concat($scope.theTeachers);
                $scope.selectedTeacher = $scope.allTeachers[0]._id;
            }
           if($scope.showingFolders) {
               $scope.displayFolders = _.filter($scope.folders, function(folder) {
                   return ($scope.selectedSubject.indexOf(folder.subject._id) > -1) && ($scope.selectedSemester.indexOf(folder.semester._id) > -1) && ($scope.selectedSchool.indexOf(folder.school._id) > -1) && ($scope.selectedTeacher.indexOf(folder.owner._id) > -1)
               })
           }else {
               $scope.displayFiles = _.filter($scope.files, function(file) {
                   return ($scope.selectedSubject.indexOf(file.subject._id) > -1) && ($scope.selectedSemester.indexOf(file.semester._id) > -1) && ($scope.selectedSchool.indexOf(file.school._id) > -1) && ($scope.selectedTeacher.indexOf(file.owner._id) > -1)
               });
           }
        };


        $scope.selectFileType = function(index) {
            $scope.selectedIndex = index;
        };
        $scope.selectFileSource = function(index) {
            $scope.selectedSource = index;
        };

        $scope.showFolders = function() {
            $scope.showingFolders = true;
            $scope.filter();
        };

        $scope.showFiles = function() {
            $scope.showingFolders = false;
            $scope.filter();
        };

        $scope.toEditFile = function(index) {
            $scope.index = index;
            $scope.theFile= $scope.uploader.queue[index].file;
            var dotIndex = $scope.theFile.name.lastIndexOf('.');
            $scope.editFile.fileName = $scope.theFile.name.substr(0, dotIndex < 0 ? $scope.theFile.name.length : dotIndex);
            $scope.editFile.extension = $scope.theFile.name.substr(dotIndex < 0 ? $scope.theFile.name.length : dotIndex, $scope.theFile.name.length);
            $scope.editFile.description = $scope.theFile.description;
            $('#editFileDialog').modal('show');
        };
        $scope.editFile = function() {
            $scope.uploader.queue[$scope.index].file.name = $scope.editFile.fileName + $scope.editFile.extension;
            $scope.uploader.queue[$scope.index].file.description = $scope.editFile.description;
            $('#editFileDialog').modal('hide');
        };

        $scope.toAddDescription = function(index) {
            $scope.index = index;
            $('#addDescriptionDialog').modal('show');
        };
        $scope.addDescription = function() {
            $scope.uploader.queue[$scope.index].file.description = $scope.newResource.description;
            $scope.newResource.description = null;
            $('#addDescriptionDialog').modal('hide');
        };
        $scope.uploader = new FileUploader({
            url: "/repository",
            method: "POST",
            queueLimit: 10
        });

        $scope.uploader.filters.push({
            name: 'queueLimit',
            fn: function () {
                $scope.error.limit = (this.queue.length > 10);
                return this.queue.length < 11;
            }
        });

        $scope.uploader.onBeforeUploadItem = function(item) {
            item.formData = [{description: item.file.description, createBy: 'root', semester: $scope.newResource.semester._id, subject: $scope.newResource.subject._id}];
        };

        $scope.uploader.onErrorItem = function(item, response, status) {
            swal({title: " 上传失败", text: response.message,type: 'error'});
            if (status == 406) {
                $scope.uploader.clearQueue();
            }
        };
        $scope.uploader.onSuccessItem = function(item, response) {
            response.subject = $scope.newResource.subject;
            response.semester = $scope.newResource.semester;
            response.owner = me;
            $scope.displayFiles.push(response);
            //$rootScope.$broadcast('addFile', {folderId: folder._id, updated_at: Date.now()});
        };
        $scope.uploader.onCompleteAll = function() {
            $timeout(function() {
                swal({title: "上传成功", type: 'success', timer: 2000});
                $('#addResourceDialog').modal('hide');
                $scope.uploader.clearQueue();
            }, 1200);
        };
        $scope.gridOptions =
            {
                    data: 'displayFolders',
                    multiSelect: false,
                    enableFiltering: true,
                    //rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
                    //'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
                    //'class="ngCell {{col.cellClass}}" ng-cell></div>',
                    columnDefs: [
                            {field: '_id', visible: false},
                            {field: 'name', displayName: '文件夹名称'},
                            {field: 'subject.name', displayName: '科目'},
                            {field: 'semester.name', displayName: '年级'},
                            {field: 'owner.name', displayName: '创建人'},
                            {field: 'school.name', displayName: '学校'},
                            {field: 'created_at', displayName: '创建时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.created_at"></span>'},
                            {field: 'name', displayName: '编辑', cellTemplate:
                            '<div class="ngCellText" ng-class="col.colIndex()">' +
                            '<a class="fa fa-edit text-success fa-2x" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
                            '<a class="fa fa-star-o text-success fa-2x" ng-click="removeStudent($event, row)"></a> &nbsp;&nbsp;' +
                            '<a class="fa fa-close text-danger fa-2x " ng-click="removeFolder($event, row)"></a>' +
                            '</div>'}
                    ],
                    selectedItems: [],
                    filterOptions: $scope.filterOptions2
            };
        $scope.columnDefs1 =  [
            {field: '_id', visible: false},
            {field: 'type', displayName: '文件类型',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
            {field: 'originalname', displayName: '文件名称', cellTemplate: '<div><a ng-click="selectFile(row.entity)">{{row.entity.originalname}}</a></div>'},
            {field: 'size', displayName: '大小', cellTemplate: '<div>{{row.entity.size | fileSizeFilter}}</div>'},
            {filed: 'like', displayName: '点赞', cellTemplate: '<div>{{row.entity.like.length}}</div>'},
            {field: 'shared', displayName: '状态', cellTemplate: '<div>{{row.entity | fileStatusFilter}}</div>'},
            {field: 'subject.name', displayName: '科目'},
            {field: 'semester.name', displayName: '年级'},
            {field: 'owner.name', displayName: '创建人'},
            {field: 'school.name', displayName: '学校'},
            {field: 'created_at', displayName: '创建时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.created_at"></span>'},
            {field: 'updated_at', displayName: '更新时间', cellTemplate: '<span class="label label-warning" am-time-ago="row.entity.updated_at"></span>'},
            {field: 'deleted', visible: false},
            {field: 'name', displayName: '编辑', cellTemplate:
            '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
            '<a class="fa fa-edit text-success fa-2x" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
            //'<a class="fa fa-star-o text-success fa-2x" ng-click="removeStudent($event, row)"></a> &nbsp;&nbsp;' +
            '<a class="fa fa-close text-danger fa-2x" ng-hide="row.entity.deleted" ng-click="deleteFile($event, row)"></a>' +
            '</div>'}
        ];
        $scope.columnDefs2 =  [
            {field: '_id', visible: false},
            {field: 'type', displayName: '文件类型',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
            {field: 'originalname', displayName: '文件名称',cellTemplate: '<div><a ng-click="selectFile(row.entity)">{{row.entity.originalname}}</a></div>'},
            {field: 'size', displayName: '大小', cellTemplate: '<div>{{row.entity.size | fileSizeFilter}}</div>'},
            {field: 'subject.name', displayName: '科目'},
            {field: 'semester.name', displayName: '年级'},
            {field: 'owner.name', displayName: '创建人'},
            {field: 'school.name', displayName: '学校'},
            {field: 'created_at', displayName: '创建时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.created_at"></span>'},
            //{field: 'updated_at', displayName: '更新', cellTemplate: '<span class="label label-warning" am-time-ago="row.entity.updated_at"></span>'},
            {field: 'deleted_at', displayName: '删除时间', cellTemplate: '<span class="label label-danger" am-time-ago="row.entity.deleted_at"></span>'},
            {field: 'deleted', visible: false},
            {field: 'name', displayName: '编辑', cellTemplate:
            '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
            //'<a class="fa fa-edit text-success fa-2x" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
            '<a class="fa fa-undo text-warning fa-2x " ng-click="deleteFile($event, row)"></a>' +
            '</div>'}
        ];
        $scope.columnDefs = $scope.columnDefs1;
        $scope.gridOptions2 =
        {
            data: 'displayFiles',
            multiSelect: false,
            enableFiltering: true,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseout="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: 'columnDefs',
            selectedItems: [],
            filterOptions: $scope.filterOptions
        };


        $scope.deleteFile = function (event, row) {
            event.stopPropagation();
            swal({
                    title: "删除文件",
                    text: "您确定要删除"+row.entity.originalname+"吗?\n删除之后，文件信息将无法找回",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false },
                function(){
                    FileDataProvider.deleteFile(row.entity._id)
                        .success(function(file){
                            swal({title: "删除成功", type: "success", timer: 1000 });
                            row.entity.deleted = true;
                            row.entity.deleted_at = file.deleted_at;
                            $scope.columnDefs = $scope.columnDefs1;
                            //$scope.files.splice($scope.files.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            swal({title: "删除失败", text: "请重试", type: 'error'})
                        })
                });
        };

        $scope.clickLike = function(fileId) {
            if($scope.liked) {
                $('#likeButton').removeClass('fa-heart-o').addClass('text-danger fa-heart');
            }else {
                $('#likeButton').removeClass('text-danger fa-heart').addClass('fa-heart-o');
            }
            FileDataProvider.changeFileLike(fileId, me._id, $scope.liked)
                .success(function(editedFile) {
                    $scope.file.like = editedFile.like;
                    _.findWhere($scope.displayFiles, {_id: fileId}).like = editedFile.like;
                })
                .error(function(err) {
                    console.error(err);
                });
        };


        $scope.selectFile = function (file) {
            //event.stopPropagation();
            $scope.file = null;
            $scope.file = file;
            $scope.liked = $scope.file.like.indexOf(me._id) > -1;
            console.log($scope.liked);
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
        // Custom Selects
        if ($('[data-toggle="select"]').length) {
            $('[data-toggle="select"]').select2();
        }
    }]);