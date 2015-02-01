angular.module('common')
    .filter('fileStatusFilter', function($sce) {
        return function(value) {
            //console.log(value.deleted);
            if (value.deleted) {
                return $sce.trustAsHtml('<span class="label label-danger">已删除</span>')
            }else {
                return value.shared ? $sce.trustAsHtml('<span class="label label-success">共&nbsp;&nbsp; &nbsp;&nbsp;享</span>') : $sce.trustAsHtml('<span class="label label-inverse">非共享</span>')
            }
        };
    });