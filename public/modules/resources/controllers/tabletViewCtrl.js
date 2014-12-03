angular.module('resources')
    .controller('tabletViewController',
    ['theTablet','TabletDataProvider', '$scope', 'AuthService', 'RoomDataProvider', '$location', '$stateParams',
        function (theTablet,TabletDataProvider, $scope, AuthService, RoomDataProvider, $location, $stateParams) {
            $scope.tablet = theTablet;
            console.log(theTablet);

            TabletDataProvider.getTabletUser($scope.tablet._id).success(function(record){
                if(record){
                    $scope.user = record[0].userId.name
                }else{
                    $scope.user = "暂无"
                }
            })

        }
    ]
);