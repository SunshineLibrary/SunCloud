angular.module('common')
.filter('fileSizeFilter', function() {
    return function(size) {
        if( (size/1024/1024) > 1) {
            return Math.round(size/1024/1024) + ' MB';
        }else if(size/1024 > 1) {
            return Math.round(size/1024) + ' KB'
        }else {
            return size + ' bytes'
        }
        //if()
        //return $sce.trustAsHtml('<span>{{size/1024}} MB</span>');
        //if(type === 'image') {
        //    return $sce.trustAsHtml('<span class="label label-success"><i class="fa fa-image"></i> 图片</span>');
        //}
    };
});