angular.module('common')
    .factory('SemesterDataProvider', ['$http', '$q', function ($http, $q) {

        var getSemester = function(semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/semesters/" + semesterId
            }).success(function(semester){
                defered.resolve(semester);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAllSemesters = function () {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/semesters"
            }).success(function (semesters) {
                defered.resolve(semesters);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var createSemester = function(name) {
            return $http({
                method: "POST",
                url: '/semesters',
                data: {
                    name: name
                }
            })
        };

        var editSemester = function(info) {
            return $http({
                method: "PUT",
                url: '/semesters/' + info._id,
                data: {
                    name: info.name
                }
            })
        };

        var deleteSemester = function(semesterId) {
            return $http({
                method: "DELETE",
                url: '/semesters/' + semesterId
            })
        };



        return {
            getSemester: getSemester,
            getAllSemesters: getAllSemesters,
            createSemester: createSemester,
            editSemester: editSemester,
            deleteSemester: deleteSemester

        };
    }]);
