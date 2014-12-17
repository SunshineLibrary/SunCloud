angular.module('resources')
    .factory('FileDataProvider', ['$http', '$q', function ($http, $q) {

        var getFile = function(fileId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files/" + fileId + "?populate=subject,semester,owner"
            }).success(function(file){
                defered.resolve(file);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAllFiles = function () {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files"
            }).success(function (files) {
                defered.resolve(files);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };


        return {
            getFile: getFile,
            getAllFiles: getAllFiles

        };
    }]);
