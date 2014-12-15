angular.module('schools')
    .controller('classesRootController',
    ['rooms', 'RoomDataProvider', '$scope', '$location',
        function (rooms, TeacherDataProvider, $scope, $location) {
            $scope.rooms = rooms;



            $scope.gridOptions =
            {
                data: 'rooms',
                multiSelect: false,
                columnDefs: [
                    {field: '_id', visible: false},
                    {field: 'name', displayName: '班级名'},
                    {field: 'school.name', displayName: '学校'},
                    //{field: 'grade', displayName: '年级', width: 50}
                    //{field: 'loginDateLocal', displayName: '上次登录时间', width: 170}
                ],
                selectedItems: []
            };


            $scope.selectClass = function () {
                $location.path('/rooms/' + $scope.gridOptions.selectedItems[0]._id);
            };

        }]);
