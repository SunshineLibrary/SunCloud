angular.module('sunpack')
    .controller('myRoomFileController',
    ['$scope', 'file', 'FileDataProvider', 'FileUploader','$http', function ($scope, file, FileDataProvider, FileUploader, $http) {
        $scope.file = file;
        $scope.temp = {};


    }]);