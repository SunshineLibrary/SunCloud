angular.module('sunpack')
    .controller('myRoomFileController',
    ['$scope', 'file','$sce', function ($scope, file, $sce) {
        $scope.file = file;
        $scope.temp = {};

        var mimetype = $scope.file.mimetype;
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

        //var myPlayer = videojs('sunvideo');

        $scope.fileUrl = $sce.trustAsResourceUrl('/sunpack/' + file._id);
        $scope.videoUrl = $sce.trustAsResourceUrl('/sunpack/' + file._id);




    }]);