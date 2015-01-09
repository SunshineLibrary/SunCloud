angular.module('resources')
.filter('fileSizeFilter', function() {
    return function(size) {
        if( size/1024/1024 > 1) {
            return (size/1024/2014).toFixed(0) + ' MB';
        }else {
            return (size/1024).toFixed(0) + ' KB'
        }
        //if()
        //return $sce.trustAsHtml('<span>{{size/1024}} MB</span>');
        //if(type === 'image') {
        //    return $sce.trustAsHtml('<span class="label label-success"><i class="fa fa-image"></i> 图片</span>');
        //}
    };
});