angular.module('resources')
    .factory('SubjectDataProvider', ['$http', '$q', function ($http, $q) {

        var getSubject = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/subjects/" + subjectId
            }).success(function(subject){
                defered.resolve(subject);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAllSubjects = function () {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/subjects"
            }).success(function (subjects) {
                defered.resolve(subjects);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };


        return {
            getSubejct: getSubject,
            getAllSubjects: getAllSubjects

        };
    }]);
