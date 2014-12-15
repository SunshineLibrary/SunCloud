angular.module('schoolManage')
    .factory('TabletDataProvider', ['$http', '$q', function ($http, $q) {
        var getXiaoshuLogCountBySchool = function (schoolId, callBack) {
            $http({
                method: "GET",
                url: "/usertablet/count?schoolId=" + schoolId
            }).success(function (counts) {
                callBack(null, counts.count);
            }).error(function (err) {
                console.error(err);
                callback(err);
            });
        };

        var getTabletsBySchool = function(schoolId, callBack) {
            var defered = $q.defer();
            var tabletsBySchoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/tablets?school=" + schoolId
            }).success(function(tablets) {
                defered.resolve(tablets);
                if(callBack) {
                    callBack(tablets);
                }
            }).error(function (err) {
                console.error(err);
            });
            return tabletsBySchoolPromise;
        };

        var getTabletCountBySchool = function(schoolId, callBack) {
            var defered = $q.defer();
            var tabletsBySchoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/tablets/count?school=" + schoolId
            }).success(function(tablets) {
                defered.resolve(tablets);
                if(callBack) {
                    callBack(null, tablets.count);
                }
            }).error(function (err) {
                console.error(err);
                callBack(err);
            });
            return tabletsBySchoolPromise;
        };

        var getTablet = function(tabletId) {
            var defered = $q.defer();
            var tabletPromise = defered.promise;
            $http({
                method: "GET",
                url: "/tablets/"+tabletId + "?populate=school"
            }).success(function(tablet) {
                defered.resolve(tablet);
            }).error(function (err) {
                console.error(err);
                defered.reject(err);
            });
            return tabletPromise;

        };

        var getTabletUser = function(tabletId) {
            return $http({
                method: "GET",
                url: "/usertablets?tabletId="+tabletId+"&logout_at&populate=userId"
            })
        };

        var logout = function(userId, tabletId) {
            return $http({
                method: 'GET',
                url: '/usertablet?userId=' + userId + '&tabletId=' + tabletId
            })
        };

        return {
            getXiaoshuLogCountBySchool: getXiaoshuLogCountBySchool,
            getTabletsBySchool: getTabletsBySchool,
            getTabletCountBySchool: getTabletCountBySchool,
            getTablet: getTablet,
            getTabletUser: getTabletUser,
            logout: logout

        };
    }]);
