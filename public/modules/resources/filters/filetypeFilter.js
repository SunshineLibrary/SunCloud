angular.module('resources')
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