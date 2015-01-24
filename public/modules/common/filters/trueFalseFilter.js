angular.module('common')
    .filter('trueFalseFilter', function() {
        return function(value) {
            console.log('ssss',value);
            return value? '是': '否'
        };
    });