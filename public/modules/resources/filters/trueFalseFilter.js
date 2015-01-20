angular.module('resources')
    .filter('trueFalseFilter', function() {
        return function(value) {
            console.log('ssss',value);
            return value? '是': '否'
        };
    });