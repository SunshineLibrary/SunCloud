angular.module('sunpack')
    .controller('folderController',
    ['$scope', 'folder', 'RoomDataProvider', 'FolderDataProvider', 'FileDataProvider','AuthService', '$stateParams', 'FileUploader', '$state', '$timeout', function ($scope, folder, RoomDataProvider, FolderDataProvider, FileDataProvider,AuthService, $stateParams, FileUploader, $state, $timeout) {
        $scope.folder = folder;
        $scope.files = $scope.folder.files;
        $scope.myRoomsAssigned = [];
        $scope.error = {};
        $scope.temp = {};
        $scope.editFile = {};
        var me = AuthService.me;
        var myRoomsPromise = RoomDataProvider.getRoomsByTeacher(me._id);

        myRoomsPromise.then(function(myRooms) {
            $scope.myRooms = myRooms;
            $scope.myRoomsAssigned = _.filter(myRooms, function(myRoom) {
                return _.contains(myRoom.sunpack, folder._id)
            })
        });

        $scope.toAssignFolder = function() {
            _.each($scope.myRooms, function(myRoom) {
                myRoom.assigned = _.contains(myRoom.sunpack, folder._id);
            });
          $('#assignFolderDialog').modal('show');
        };

        $scope.checkAll = function() {
            _.each($scope.myRooms, function(myRoom) {
                myRoom.assigned = true;
            })
        };
        $scope.uncheckAll = function() {
            _.each($scope.myRooms, function(myRoom) {
                myRoom.assigned = false;
            })
        };

        $scope.assignToRooms = function() {
            var assignment = _.map($scope.myRooms, function(myRoom) {
                return {roomId: myRoom._id, assigned: myRoom.assigned};
            });
            console.log(assignment);
            FolderDataProvider.addFolderToRooms($scope.folder._id, assignment)
                .success(function(res) {
                    console.log('success response:');
                    console.log(res);
                    $('#assignFolderDialog').modal('hide');
                    swal({title:"分配成功", type: "success", timer: 1000});
                    _.each($scope.myRooms, function(myRoom) {
                        var i = myRoom.sunpack.indexOf(folder._id);
                        if(myRoom.assigned && i === -1) {
                            myRoom.sunpack.push(folder._id);
                        }
                        if(!myRoom.assigned && i > -1) {
                            myRoom.sunpack.splice(i, 1);
                        }

                    });
                    $scope.myRoomsAssigned = _.filter($scope.myRooms, function(myRoom) {
                        return myRoom.assigned;
                    });

                })
                .error(function(err){
                    console.error(err);
                    swal({title:"分配失败", text: "请重试", type: "error", timer: 2000})
                })
        };

        $scope.toEditFile = function(index) {
            $scope.index = index;
            $scope.theFile= $scope.uploader.queue[index].file;
            var dotIndex = $scope.theFile.name.lastIndexOf('.');
            $scope.editFile.fileName = $scope.theFile.name.substr(0, dotIndex < 0 ? $scope.theFile.name.length : dotIndex);
            $scope.editFile.extension = $scope.theFile.name.substr(dotIndex < 0 ? $scope.theFile.name.length : dotIndex, $scope.theFile.name.length);
            $scope.editFile.description = $scope.theFile.description;
            $('#editFileBeforeUploadDialog').modal('show');
        };
        $scope.editFileNameAndDescription= function() {
            $scope.uploader.queue[$scope.index].file.name = $scope.editFile.fileName + $scope.editFile.extension;
            $scope.uploader.queue[$scope.index].file.description = $scope.editFile.description;
            $('#editFileBeforeUploadDialog').modal('hide');
        };

        $scope.toAddDescription = function(index) {
            $scope.index = index;
            $('#addDescriptionDialog').modal('show');
        };
        $scope.addDescription = function() {
            $scope.uploader.queue[$scope.index].file.description = $scope.temp.description;
            $scope.temp.description = null;
            $('#addDescriptionDialog').modal('hide');
        };
        $scope.toAddDescriptionOnRow = function(row) {
            $scope.row = row;
            $('#addDescriptionOnRowDialog').modal('show');
        };
        $scope.addDescriptionOnRow = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.description = $scope.temp.description;
            FileDataProvider.addDescription(info).success(function(newFile) {
                swal({title: '添加描述成功', type: 'success', timer: 1500});
                $scope.row.entity.description = newFile.description;
                $('#addDescriptionOnRowDialog').modal('hide');
                $scope.temp.description = null;
            }).error(function(err) {
                console.error(err);
                swal({title: '添加描述失败', text: '请重试',type: 'error', timer: 2000});
            });
        };
        $scope.uploader = new FileUploader({
            url: "/upload/files/" + folder._id,
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
            console.log(item);
            console.log('~~~~~', typeof item.file.description === "undefined");

            item.formData = [{description: (typeof item.file.description === "undefined") ? "": item.file.description}];
            console.log('~~',item.formData);
        };
        $scope.uploader.onErrorItem = function(item, response, status) {
            swal({title: " 上传失败", text: response.message,type: 'error'});
            if (status == 406) {
                $scope.uploader.clearQueue();
            }
        };
        $scope.uploader.onSuccessItem = function(item, response) {
            $scope.files.push(response);
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $timeout(function() {
                swal({title: "上传成功", type: 'success', timer: 2000});
                $('#uploadFileDialog').modal('hide');
                $scope.uploader.clearQueue();
                console.log('update with timeout fired')
            }, 2000);
        };

        $scope.editFileUploader = new FileUploader({
            url: "/edit/file",
            method: "POST",
            queueLimit: 1
        });
        $scope.editFileUploader.onBeforeUploadItem = function(item) {
            var name = $scope.temp.newFileName;
            var description =  (typeof $scope.temp.newFileDescription === "undefined") ? "": $scope.temp.newFileDescription;
            item.formData = [{fileId: $scope.row.entity._id,originalname: name,description: description}];
        };

        $scope.showEditFolderDialog = function() {
            $('#editFolderDialog').modal('show');
            $scope.temp.newName = $scope.folder.name;
            $scope.temp.newSemester = _.find($scope.semesters, function(semester) {
                return semester._id === $scope.folder.semester._id
            });
        };
        $scope.editFolder = function() {
            var info = {};
            info._id = $scope.folder._id;
            info.name = $scope.temp.newName;
            info.semester = $scope.temp.newSemester._id;
            if (folder.semester._id.toString() === info.semester.toString()) {
                FolderDataProvider.editFolderName(info)
                    .success(function(editedFolder) {
                        $scope.folder.name = editedFolder.name;
                        $('#editFolderDialog').modal('hide');
                        swal({title: "修改成功", type: "success", timer: 1000 });
                    })
                    .error(function(err) {
                        console.error(err);
                        $scope.error = true;
                        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                    })
            }else {
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
                        swal({title: "修改失败", text: err, type: "error", timer: 2000 });
                    })
            }

        };

        $scope.showEditFileDialog = function(event, row) {
            event.stopPropagation();
            $('#editFileDialog').modal('show');
            $scope.row = row;
            var dotIndex = $scope.row.entity.originalname.lastIndexOf('.');
            $scope.temp.newFileName = $scope.row.entity.originalname.substr(0, dotIndex < 0 ? $scope.row.entity.originalname.length : dotIndex);
            $scope.temp.extension = $scope.row.entity.originalname.substr(dotIndex < 0 ? $scope.row.entity.originalname.length : dotIndex, $scope.row.entity.originalname.length);
            $scope.temp.newFileDescription = row.entity.description;
        };


        $scope.editFile = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.temp.newFileName + $scope.temp.extension;
            info.description = $scope.temp.newFileDescription;
            if($scope.editFileUploader.queue.length) {
                $scope.editFileUploader.uploadAll();
                $scope.editFileUploader.onErrorItem = function(item, response, status) {
                    swal({title: " 修改文件内容失败", text: response.message,type: 'error', timer: 2000});
                    if (status == 406) {
                        $scope.uploader.clearQueue();
                    }
                };
                $scope.editFileUploader.onSuccessItem = function(item, response) {
                    swal({title: "修改文件成功", type: 'success', timer: 2000});
                    $('#editFileDialog').modal('hide');
                    $scope.row.entity.originalname = response.originalname;
                    $scope.row.entity.description = response.description;
                    $scope.row.entity.size = response.size;
                };
            }else {
                FileDataProvider.editFileNameAndDescription(info)
                    .success(function(editedFile) {
                        $scope.row.entity.originalname = editedFile.originalname;
                        $scope.row.entity.description = editedFile.description;
                        $scope.temp = {};
                        swal({title: '修改成功', type: 'success', timer: 2000});
                        $('#editFileDialog').modal('hide');
                    })
                    .error(function(err) {
                        console.error(err);
                        swal({title: '修改失败', text: '请重试', type: 'error'});
                    })
            }
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

        $scope.gridOptions =
        {
            data: 'files',
            multiSelect: false,
            enableColumnResize: true,
            rowTemplate: '<div  ng-mouseover="$parent.showedit=true" ng-mouseleave="$parent.showedit=false" ng-style="{\'cursor\': row.cursor, \'z-index\': col.zIndex() }" ' +
            'ng-repeat="col in renderedColumns" ng-class="col.colIndex()" ' +
            'class="ngCell {{col.cellClass}}" ng-cell></div>',
            columnDefs: [
                {field: '_id', visible: false},
                {field: 'type', displayName: '类型', width: '8%',cellTemplate: '<div><span ng-bind-html="row.entity.type | typeFilter"></span></div>'},
                {field: 'originalname', displayName: '文件名称', width: '35%', cellTemplate: '<div><a ng-click="selectFile(row.entity._id)">{{row.entity.originalname}}</a></div>'},
                {field: 'description', displayName: '描述', cellTemplate: '<div ng-show="row.entity.description">' +
                '<a title="文件描述:{{row.entity.description}}" id="info-tooltip" data-placement="right" data-toggle="tooltip"  type="button"><i class="glyphicon glyphicon-info-sign text-success" ng-mouseover="tooltip()"></i></a>'+
                ' {{row.entity.description}}</div><div ng-hide="row.entity.description"><button class="btn btn-xs btn-success" ng-click="toAddDescriptionOnRow(row)"><i class="fa fa-comments"></i> 添加</button></div>'},
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


        $scope.selectFile = function (fileId) {
            $state.go('sunpack.subject.folder.file', {fileId: fileId});
        };


        // Checkboxes and Radiobuttons

        $('[data-toggle="checkbox"]').radiocheck();
        $('[data-toggle="radio"]').radiocheck();
        // Table: Toggle all checkboxes
        $('.table .toggle-all :checkbox').on('click', function () {
            var $this = $(this);
            var ch = $this.prop('checked');
            $this.closest('.table').find('tbody :checkbox').radiocheck(!ch ? 'uncheck' : 'check');
        });
        //Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });
        //// Tooltips
        //$('[data-toggle="tooltip"]').tooltip();
        //// Add style class name to a tooltips
        //$('.tooltip').addClass(function () {
        //    if ($(this).prev().attr('data-tooltip-style')) {
        //        return 'tooltip-' + $(this).prev().attr('data-tooltip-style');
        //    }
        //});
        //
        //$(function () {
        //    $('[data-toggle="tooltip"]').tooltip()
        //})
        $scope.tooltip = function() {
             console.log('tool~~~~~');
            $('[data-toggle="tooltip"]').tooltip();
            // Add style class name to a tooltips
            $('.tooltip').addClass(function () {
                if ($(this).prev().attr('data-tooltip-style')) {
                    return 'tooltip-' + $(this).prev().attr('data-tooltip-style');
                }
            });
        };
        $scope.popover = function() {
            $('[data-toggle="popover"]').popover();
        };
        //$('#info-tooltip').tooltip('show');
        //
        ////$('[data-toggle="tooltip"]').tooltip();
        //$( document ).ready(function() {
        //    //$('[data-toggle="tooltip"]').tooltip("show");
        //    $('#info-tooltip').tooltip('show');
        //});

        $('[data-toggle="checkbox"]').radiocheck();
        // Prevent jQuery UI dialog from blocking focusin
        $(document).on('focusin', function(e) {
            if ($(event.target).closest(".mce-window").length) {
                e.stopImmediatePropagation();
            }
        });


    }
    ]
)
    .filter('typeFilter', function($sce) {
        return function(type) {
            if(type === 'image') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-image"></i> 图片</span>');
            }
            if(type === 'audio') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-music"></i> 音频</span>');
            }
            if(type === 'video') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-video-camera"></i> 视频</span>');
            }
            if(type === 'doc') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-file-text"></i> 文档</span>');
            }
            if(type === 'ebook') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-book"></i> 电子书</span>');
            }
            if(type === 'application') {
                return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-cogs"></i> 应用</span>');
            }
            return $sce.trustAsHtml('<span class="label label-info"><i class="fa fa-file"></i> 其他</span>');
        };
    });