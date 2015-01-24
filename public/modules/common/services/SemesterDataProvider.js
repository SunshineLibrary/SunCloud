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


        return {
            getSemester: getSemester,
            getAllSemesters: getAllSemesters

        };
    }]);
