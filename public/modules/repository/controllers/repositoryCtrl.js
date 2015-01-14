angular.module('repository')
.controller('repositoryController',
    ['$scope', 'subjects', 'semesters', 'schools', 'teachers', 'folders', 'files','FolderDataProvider', 'FileDataProvider', 'Authentication', 'FileUploader',function($scope, subjects, semesters, schools, teachers, folders, files, FolderDataProvider, FileDataProvider , Authentication, FileUploader) {
        $scope.subjects = subjects;
        $scope.semesters = semesters;
        $scope.schools = schools;
        $scope.teachers = teachers;
        $scope.folders = folders;
        $scope.displayFolders = $scope.folders;
        $scope.files = files;
        $scope.displayFiles = $scope.files;
        $scope.filterOptions = {filterText: ''};
        $scope.showingFolders = true;
        $scope.isCreatingFolder = false;
        $scope.newFolderName = null;
        $scope.newResource = {};
        $scope.editFile = {};
        $scope.error = {};
        $scope.rootFolders = _.filter($scope.folders, function(folder) {
            return folder.owner.roles.indexOf('root') > -1
        });
        var me = Authentication.user;
        var subjectIds = _.map($scope.subjects, function(subject) {return subject._id});
        var semesterIds =  _.map($scope.semesters, function(semester) {return semester._id});
        var schoolsIds = _.map($scope.schools, function(school) {return school._id});
        var types =   ['image', 'video', 'audio', 'doc', 'ebook', 'application'];
        $scope.allSubjects = [{_id: subjectIds, name: '所有科目'}].concat($scope.subjects);
        $scope.allSemesters = [{_id: semesterIds, name: '所有年级'}].concat($scope.semesters);
        $scope.allSchools =     [{_id: schoolsIds, name: '所有学校'}].concat($scope.schools);

        $scope.selectedSubject = $scope.allSubjects[0]._id;
        $scope.selectedSemester = $scope.allSemesters[0]._id;
        $scope.selectedSchool = $scope.allSchools[0]._id;

        //$scope.theTeachers = _.filter($scope.teachers, function(teacher) {
        //    return newSchool.indexOf(teacher.school) > -1
        //});
        var teacherIds = _.map($scope.teachers, function(teacher) {return teacher._id});
        $scope.allTeachers = [{_id: teacherIds, name: '所有老师'}].concat($scope.teachers);
        $scope.selectedTeacher = $scope.allTeachers[0]._id;
        //
        //$scope.$watch('selectedSchool', function(newSchool) {
        //    if(newSchool) {
        //        $scope.theTeachers = _.filter($scope.teachers, function(teacher) {
        //            return newSchool.indexOf(teacher.school) > -1
        //        });
        //        var teacherIds = _.map($scope.theTeachers, function(teacher) {return teacher._id});
        //        $scope.allTeachers = [{_id: teacherIds, name: '所有老师'}].concat($scope.theTeachers);
        //        $scope.selectedTeacher = $scope.allTeachers[0]._id;
        //    }
        //});

        $scope.$watchGroup(['newResource.subject', 'newResource.semester'], function(newValue) {
           if(newValue) {
               $scope.theRootFolders = _.filter($scope.rootFolders, function(folder) {
                   return ( newValue[0] ? folder.subject._id.toString() === newValue[0]._id.toString() : true ) && (newValue[1] ? folder.semester._id.toString() === newValue[1]._id.toString() : true);
                   //return folder.subject._id.toString() === newValue[0]._id.toString() && folder.semester._id.toString() === newValue[1]._id.toString()
               })
           }
        });


        $scope.filter = function(selectedSchool, selectedTeacher) {
            console.log($scope.selectedTeacher);
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
               console.log('selectedSchool',$scope.selectedSchool);
               console.log('selectedTeacher',$scope.selectedTeacher);
               $scope.displayFiles = _.filter($scope.files, function(file) {
                   return ($scope.selectedSubject.indexOf(file.subject._id) > -1) && ($scope.selectedSemester.indexOf(file.semester._id) > -1) && ($scope.selectedSchool.indexOf(file.school._id) > -1) && ($scope.selectedTeacher.indexOf(file.owner._id) > -1)
               });
           }
        };

        $scope.showFolders = function() {
            $scope.showingFolders = true;
            $scope.filter();
        };

        $scope.showFiles = function() {
            $scope.showingFolders = false;
            $scope.filter();
        };

        $scope.toCreateFolder = function() {
            $scope.isCreatingFolder = true;
        };
        $scope.createFolder = function() {
            $scope.error = {};
            if($scope.newResource.subject === '' || $scope.newResource.subject === null || $scope.newResource.subject === undefined) {
                $scope.error.subject = true;
                return;
            }
            if($scope.newResource.semester === '' || $scope.newResource.semester === null || $scope.newResource.semester === undefined) {
                $scope.error.semester = true;
                return;
            }
            if($scope.newFolderName === '' || $scope.newFolderName === null || $scope.newFolderName === undefined) {
                $scope.error.folder = true;
                return;
            }
            $scope.isCreatingFolder = false;
            var info = {};
            info.name = $scope.newFolderName;
            info.subject = $scope.newResource.subject._id;
            info.semester = $scope.newResource.semester._id;
            info.owner = me._id;
            info.school = me.school;
            FolderDataProvider.createFolder(info).success(function(newFolder) {
                console.log(newFolder);
                $scope.folders.push(newFolder);
                $scope.rootFolders.push(newFolder);
                $scope.theRootFolders.push(newFolder);
                $scope.newResource.folderId = newFolder._id;
                newFolder.subject = $scope.newResource.subject;
                newFolder.semester = $scope.newResource.semester;
                newFolder.owner = me;
                $scope.newFolderName = null;
            })



        };
        $scope.cancelCreate = function() {
            $scope.isCreatingFolder = false;
            $scope.error = {};
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
            //$scope.theFile = $scope.uploader.queue[index].file;
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
            item.formData = [{folderId: $scope.newResource.folderId, description: item.file.description}];
        };

        $scope.uploader.onErrorItem = function(item, response, status) {
            swal({title: " 上传失败", text: response.message,type: 'error'});
            if (status == 406) {
                $scope.uploader.clearQueue();
            }
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
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
                            //{field: 'name', displayName: '分享次数'},
                            //{field: 'name', displayName: '使用人数'},
                            //{field: 'tablet', displayName: '正在使用的晓书',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/#/tablets/{{row.entity.tablet}}">{{row.getProperty(col.field)}}</a></div>'},
                            {field: 'name', displayName: '编辑', cellTemplate:
                            '<div class="ngCellText" ng-class="col.colIndex()">' +
                            '<a class="fa fa-edit text-success fa-2x" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
                            //'<a class="fui-cross text-danger" ng-click="removeStudent($event, row)"></a>' +
                            '<a class="fa fa-star-o text-success fa-2x" ng-click="removeStudent($event, row)"></a> &nbsp;&nbsp;' +
                            '<a class="fa fa-close text-danger fa-2x " ng-click="removeFolder($event, row)"></a>' +

                            '</div>'}

                            //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
                    ],
                    selectedItems: [],
                    filterOptions: $scope.filterOptions
            };

        $scope.gridOptions2 =
        {
            data: 'displayFiles',
            multiSelect: false,
            enableFiltering: true,
            //rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            //'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            //'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'type', displayName: '文件类型',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
                {field: 'originalname', displayName: '文件名称'},
                {field: 'subject.name', displayName: '科目'},
                {field: 'semester.name', displayName: '年级'},
                {field: 'owner.name', displayName: '创建人'},
                {field: 'school.name', displayName: '学校'},
                {field: 'created_at', displayName: '创建时间', cellTemplate: '<span class="label label-success" am-time-ago="row.entity.created_at"></span>'},
                //{field: 'name', displayName: '分享次数'},
                //{field: 'name', displayName: '使用人数'},
                //{field: 'tablet', displayName: '正在使用的晓书',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="/#/tablets/{{row.entity.tablet}}">{{row.getProperty(col.field)}}</a></div>'},
                {field: 'name', displayName: '编辑', cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()">' +
                '<a class="fa fa-edit text-success fa-2x" ng-click="showEditStudentDialog($event, row)"></a> &nbsp;&nbsp;' +
                    //'<a class="fui-cross text-danger" ng-click="removeStudent($event, row)"></a>' +
                '<a class="fa fa-star-o text-success fa-2x" ng-click="removeStudent($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fa fa-close text-danger fa-2x " ng-click="deleteFile($event, row)"></a>' +

                '</div>'}

                //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
            ],
            selectedItems: [],
            filterOptions: $scope.filterOptions
        };

        $scope.deleteFile = function (event, row) {
            event.stopPropagation();
            swal({
                    title: "您确定要删除"+row.entity.originalname+"吗?",
                    text: "删除之后，文件信息将无法找回",
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
                            $scope.files.splice($scope.files.indexOf(row.entity),1);
                        })
                        .error(function(err){
                            console.error(err);
                            swal({title: "删除失败", text: "请重试", type: 'error'})
                        })
                });
        };
        $('[data-toggle="tooltip"]').tooltip();

        //// Focus state for append/prepend inputs
        //$('.input-group').on('focus', '.form-control', function () {
        //    $(this).closest('.input-group, .form-group').addClass('focus');
        //}).on('blur', '.form-control', function () {
        //    $(this).closest('.input-group, .form-group').removeClass('focus');
        //});


        //$scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;

    }]);