angular.module('resources')
    .filter('timeagoFilter', function($sce) {
        return function(date) {
            console.log(date);
            //return '<span class="label label-success" am-time-ago="date"></span>';
            return $sce.trustAsHtml('<span class="label label-success" am-time-ago="date"></span>');
        };
    });