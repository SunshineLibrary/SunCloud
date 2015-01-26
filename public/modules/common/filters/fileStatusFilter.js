angular.module('common')
    .filter('fileStatusFilter', function() {
        return function(value) {
            console.log(value.deleted_at);
            if (value.deleted_at) {
                return '已删除'
            }else {
                return value.shared ? '共享': '非共享'
            }
        };
    });