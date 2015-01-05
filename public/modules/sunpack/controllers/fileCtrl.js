angular.module('sunpack')
    .controller('fileController',
    ['$scope', 'file', 'FileDataProvider',function ($scope, file, FileDataProvider) {
        $scope.file = file;
        $scope.temp = {};

        $scope.showEditFileDialog = function() {
            $('#editFileDialog').modal('show');
            $scope.temp.newName = $scope.file.originalname;
            $scope.temp.newDescription = $scope.file.description;
        };
        $scope.editFile = function() {
            var info = {};
            info._id = $scope.file._id;
            info.originalname = $scope.temp.newName;
            info.description = $scope.temp.newDescription;
            FileDataProvider.editFileNameAndDescription(info)
                .success(function(editedFile) {
                    $scope.file.originalname = editedFile.originalname;
                    $scope.file.description = editedFile.description;
                    $('#editFileDialog').modal('hide');
                    swal({title: "修改成功", type: "success", timer: 1000 });
                })
                .error(function(err) {
                    console.error(err);
                    //$scope.error = true;
                    swal({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
                })
        };

        // Focus state for append/prepend inputs
        $('.input-group').on('focus', '.form-control', function () {
            $(this).closest('.input-group, .form-group').addClass('focus');
        }).on('blur', '.form-control', function () {
            $(this).closest('.input-group, .form-group').removeClass('focus');
        });




    }]);