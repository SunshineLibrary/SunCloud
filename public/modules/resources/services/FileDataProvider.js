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
                url: "/files?populate=subject,semester,owner,school"
            }).success(function (files) {
                defered.resolve(files);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var deleteFile = function(fileId) {
            return $http({
                method: "DELETE",
                url: "/files/" + fileId
            })
        };


        var editFileNameAndDescription = function(info) {
            return $http({
                method: "PUT",
                url: "/files/" + info._id,
                data: {
                    originalname: info.name,
                    description: info.description
                }
            })
        };

        var downloadFile = function(fileId) {
            return $http({
                method: "GET",
                url: "/download/files/" + fileId
            })
        };

        return {
            getFile: getFile,
            getAllFiles: getAllFiles,
            deleteFile: deleteFile,
            editFileNameAndDescription: editFileNameAndDescription,
            downloadFile: downloadFile

        };
    }]);
