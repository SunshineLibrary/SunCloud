angular.module('sunpack')
    .controller('fileController',
    ['$scope', 'file', 'FileDataProvider', 'FileUploader',function ($scope, file, FileDataProvider, FileUploader) {
        $scope.file = file;
        $scope.temp = {};

        $scope.editFileUploader = new FileUploader({
            url: "/edit/file",
            method: "POST",
            queueLimit: 1
        });
        $scope.editFileUploader.onBeforeUploadItem = function(item) {
            var name = $scope.temp.newName;
            var description =  (typeof $scope.temp.newDescription === "undefined") ? "": $scope.temp.newDescription;
            item.formData = [{fileId: $scope.file._id,originalname: name,description: description}];
            console.log('~~',item.formData);
        };


        $scope.showEditFileDialog = function() {
            $('#editFileDialog').modal('show');
            var dotIndex = $scope.file.originalname.lastIndexOf('.');
            $scope.temp.newName = $scope.file.originalname.substr(0, dotIndex < 0 ? $scope.file.original.length : dotIndex);
            $scope.temp.extension = $scope.file.originalname.substr(dotIndex < 0 ? $scope.file.originalname.length : dotIndex, $scope.file.originalname.length);
            $scope.temp.newDescription = $scope.file.description;
        };
        $scope.editFile = function() {
            var info = {};
            info._id = $scope.file._id;
            info.name = $scope.temp.newName + $scope.temp.extension;
            info.description = $scope.temp.newDescription;
            if($scope.editFileUploader.queue.length) {
                $scope.editFileUploader.uploadAll();
                $scope.editFileUploader.onErrorItem = function(item, response, status) {
                    swal({title: " 修改文件内容失败", text: response.message,type: 'error', timer: 2000});
                    if (status == 406) {
                        $scope.uploader.clearQueue();
                    }
                };
                $scope.editFileUploader.onSuccessItem = function(item, response) {
                    //console.log(response, '~~~');
                    //console.info('onCompleteAll ~~~~~~~~~');
                    swal({title: "修改文件成功", type: 'success', timer: 2000});
                    $('#editFileDialog').modal('hide');
                    $scope.file.originalname = response.originalname;
                    $scope.file.description = response.description;
                    $scope.file.size = response.size;
                };
            }else {
                FileDataProvider.editFileNameAndDescription(info)
                    .success(function(editedFile) {
                        $scope.file.originalname = editedFile.originalname;
                        $scope.file.description = editedFile.description;
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

        $scope.addDescription = function() {
            var info = {};
            info._id = $scope.file._id;
            info.description = $scope.temp.description;
            FileDataProvider.addDescription(info).success(function(newFile) {
                swal({title: '添加描述成功', type: 'success', timer: 1500});
                $scope.file.description = newFile.description;
                $('#addDescriptionDialog').modal('hide');
                $scope.temp.description = null;
            }).error(function(err) {
                console.error(err);
                swal({title: '添加描述失败', text: '请重试',type: 'error', timer: 2000});
            });
        };

        // Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();





    }]);