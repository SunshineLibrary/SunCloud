angular.module('common')
    .factory('SchoolDataProvider', ['$http', '$q', function ($http, $q) {

        var createSchool = function (info) {
            return $http({
                method: "POST",
                url: "/schools",
                data: info
            })
        };
        var getSchool = function (schoolId, callBack) {
            var defered = $q.defer();
            var schoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/schools/" + schoolId
            }).success(function (school) {
                if(callBack){
                    callBack(school);
                }
                defered.resolve(school);
            }).error(function (err) {
                console.error(err)
            });
            return schoolPromise;
        };
        var editSchool = function (school) {
            return $http({
                method: "PUT",
                url: "/schools/" + school._id,
                data: school
            })
        };
        var deleteSchool = function (schoolId) {
            return $http({
                method: "DELETE",
                url: "/schools/" + schoolId
            })
        };
        var editSchoolName = function (schoolId, newName) {
            return $http({
                method: "PUT",
                url: "/schools/" + schoolId,
                data: {
                    name: newName
                }
            })
        };

        var resetLauncherPassword = function(schoolId, newPassword) {
            return $http({
                method: "PUT",
                url: "/schools/" + schoolId,
                data: {
                    launcherPassword: newPassword
                }
            })
        };


        return {
            createSchool: createSchool,
            getSchool: getSchool,
            editSchool: editSchool,
            deleteSchool: deleteSchool,
            editSchoolName: editSchoolName,
            resetLauncherPassword: resetLauncherPassword
        };
    }]);
