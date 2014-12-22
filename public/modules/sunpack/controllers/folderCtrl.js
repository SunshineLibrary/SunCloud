angular.module('sunpack')
    .controller('folderController',
    ['$scope', 'folder', 'RoomDataProvider', 'FolderDataProvider', 'FileDataProvider','AuthService', '$stateParams', 'FileUploader', '$state', function ($scope, folder, RoomDataProvider, FolderDataProvider, FileDataProvider,AuthService, $stateParams, FileUploader, $state) {
        $scope.folder = folder;
        $scope.files = $scope.folder.files;
        $scope.myRoomsAssigned = [];
        $scope.error = {};
        $scope.temp = {};
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


        $scope.uploader = new FileUploader({
            url: "/upload/files/" + folder._id,
            method: "POST",
            queueLimit: 10
        });

        $scope.uploader.onErrorItem = function(item, response, status) {
            swal({title: " 上传失败", text: response.message,type: 'error'});
            if (status == 406) {
                $scope.uploader.clearQueue();
            }
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
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

        $scope.showEditFileDialog = function(event, row) {
            event.stopPropagation();
            $('#editFileDialog').modal('show');
            $scope.row = row;
            $scope.temp.newFileName = row.entity.originalname;
            $scope.temp.newFileDescription = row.entity.description;
            $scope.uploader = new FileUploader({
                url: "/upload/file/" + $scope.row.entity._id,
                method: "POST",
                queueLimit: 1
            });
        };


        $scope.editFile = function(row) {
            var info = {};
            info._id = row.entity._id;
            info.name = $scope.temp.newFileName;
            info.description = $scope.temp.newFileDescription;

            $scope.uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
                $('#editFileDialog').modal('hide');
                swal({title: "修改成功", type: "success", timer: 1000 });
            };
            //FileDataProvider.editFileNameAndDescription(info)
            //    .success(function(editedFile) {
            //        $scope.row.entity.originalname = editedFile.originalname;
            //        $scope.row.entity.description = editedFile.description;
            //        console.log(editedFile);
            //        console.log($scope.uploader);
            //        //$scope.uploader.uploadAll();
            //
            //    })
            //    .error(function(err) {
            //        console.error(err);
            //        swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
            //    })
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



        $scope.downloadFile = function (event, row) {
            event.stopPropagation();
            swal({
                    title: "您确定要下载"+row.entity.originalname+"吗?",
                    //text: "删除之后，文件信息将无法找回",
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
                {field: 'mimetype', displayName: '类型', width: '15%',cellTemplate: '<div><a>{{row.entity.mimetype}}</a></div>'},
                {field: 'originalname', displayName: '文件名称', cellTemplate: '<div><a>{{row.entity.originalname}}</a></div>'},
                {field: 'users.length', displayName: '使用人数', width: '10%'},
                {field: 'size', displayName: '大小',width: '10%', cellTemplate: '<div>{{row.entity[col.field]/1024/1024 | number:2}} MB</div>'},
                {field: '', displayName: '编辑', width: '15%',cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()" ng-show="showedit">' +
                '<a class="fui-new text-success" ng-click="showEditFileDialog($event, row)"></a> &nbsp;&nbsp;' +
                '<a class="fui-cross text-danger" ng-click="deleteFile($event,row)"></a>' +
                '&nbsp;&nbsp;<a class="glyphicon glyphicon-download-alt text-primary" ng-click="downloadFile($event,row)"></a></div>'}
            ],
            selectedItems: []
        };


        $scope.selectFile = function () {
            $state.go('sunpack.subject.folder.file', {fileId: $scope.gridOptions.selectedItems[0]._id});
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
        // Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });
        // Tooltips
        $('[data-toggle="tooltip"]').tooltip();

        // Popovers
        $('[data-toggle="popover"]').popover();


    }
    ]
);