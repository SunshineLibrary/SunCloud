angular.module('sunpack')
    .controller('fileController',
    ['$scope', 'file', 'FileDataProvider', 'FileUploader','$http', '$sce', '$state', '$timeout', function ($scope, file, FileDataProvider, FileUploader, $http, $sce, $state, $timeout) {
        $scope.file = file;
        $scope.temp = {};
        $scope.shareFile = $scope.file.shared;
        var mimetype = $scope.file.mimetype;
        $scope.isSetting = false;
        if(mimetype.indexOf('pdf') > -1) {
            $scope.isPDF = true;
        }else if(mimetype.indexOf('video') > -1) {
            $scope.isVideo = true;
        }else if(mimetype.indexOf('audio') > -1) {
            $scope.isAudio = true;
        }else if(mimetype.indexOf('image') > -1) {
            $scope.isImage = true;
        }else if(mimetype.indexOf('text') > -1) {
            $scope.isText = true;
        }else {
            $scope.isOther = true;
        }



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
        $.fn.scrollView = function () {
            return this.each(function () {
                $('html, body').animate({
                    scrollTop: $(this).offset().top -53
                }, 1000);
            });
        };
        $scope.gotoPreview = function() {
            $('#anchor').scrollView();
        };

        $scope.changeShare = function() {
            $scope.isSetting = !$scope.isSetting;
        };
        $scope.changeOption = function() {
            console.log($scope.shareFile);
            FileDataProvider.changeShareOption($scope.file._id, $scope.shareFile)
                .success(function(editedFile) {
                    $scope.file.shared = editedFile.shared;
                    $scope.shareFile = $scope.file.shared;
                })
                .error(function(err) {
                    console.error(err);
                    swal({title: '修改共享选项失败', type: 'error', timer: 2000});
                });
        };

        //var myPlayer = videojs('sunvideo');

        $scope.fileUrl = $sce.trustAsResourceUrl('/sunpack/' + file._id);
        $scope.videoUrl = $sce.trustAsResourceUrl('/sunpack/' + file._id);

        //$state.transitionTo($state.current, $stateParams, {
        //    reload: true,
        //    inherit: false,
        //    notify: true
        //});


        //$scope.getSrc = function (fileId) {
        //    return '/sunpack/' + fileId  ;
        //    //return '/lib/ViewerJS/#../../sunpack/' + fileId + '&output=embed' ;
        //    //return 'www.google.com'
        //};

//
        // If absolute URL from the remote server is provided, configure the CORS
        // header on that server.
        //
        //var url = '/view/files/' + file._id;

        //
        // Disable workers to avoid yet another cross-origin issue (workers need
        // the URL of the script to be loaded, and dynamically loading a cross-origin
        // script does not work).
        //
        // PDFJS.disableWorker = true;

        //
        // In cases when the pdf.worker.js is located at the different folder than the
        // pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property
        // shall be specified.
        //
        // PDFJS.workerSrc = '../../build/pdf.worker.js';

        //
// Fetch the PDF document from the URL using promises
////
//        $http.get(url).success(function(pdf) {
//            //console.log(success);
//                pdf.getPage(1).then(function(page) {
//                    var scale = 1.5;
//                    var viewport = page.getViewport(scale);
//
//                    //
//                    // Prepare canvas using PDF page dimensions
//                    //
//                    var canvas = document.getElementById('the-canvas');
//                    var context = canvas.getContext('2d');
//                    canvas.height = viewport.height;
//                    canvas.width = viewport.width;
//
//                    //
//                    // Render PDF page into canvas context
//                    //
//                    var renderContext = {
//                        canvasContext: context,
//                        viewport: viewport
//                    };
//                    page.render(renderContext);
//                });
//        });
//        PDFJS.getDocument(url).then(function(pdf) {
//            console.log(pdf);
//            // Using promise to fetch the page
//            pdf.getPage(1).then(function(page) {
//                var scale = 1;
//                var viewport = page.getViewport(scale);
//
//                //
//                // Prepare canvas using PDF page dimensions
//                //
//                var canvas = document.getElementById('the-canvas');
//                var context = canvas.getContext('2d');
//                canvas.height = viewport.height;
//                canvas.width = viewport.width;
//
//                //
//                // Render PDF page into canvas context
//                //
//                var renderContext = {
//                    canvasContext: context,
//                    viewport: viewport
//                };
//                page.render(renderContext);
//            });
//        });


    }]);