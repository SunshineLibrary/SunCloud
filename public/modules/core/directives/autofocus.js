'use strict';

angular.module('core').directive('autofocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link : function($scope, $element) {
            $timeout(function() {
                console.log($element[0])
                $element[0].focus();
            });
        }
    }
}]);