angular.module('sunpack')
    .controller('myRoomPackController',
    ['$scope', 'myRoom',function ($scope, myRoom) {
        $scope.myRoom = myRoom;
        $scope.temp = {};
        console.log('hi I;m in myRoom state');
        console.log(myRoom);
    }]);