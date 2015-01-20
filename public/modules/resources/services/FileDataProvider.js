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

        var deleteFileFromFolder = function(fileId, folderId) {
            console.log(folderId);
            return $http({
                method: "DELETE",
                url: "/files/" + fileId + "?folderId=" + folderId
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

        var addDescription = function(info) {
            return $http({
                method: "PUT",
                url: "/files/" + info._id,
                data: {
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

        var changeShareOption = function(fileId, value) {
            return $http({
                method: "PUT",
                url: "/files/" + fileId,
                data: {
                    shared: value
                }
            })
        };

        var getSharedFilesBySchool = function(schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            var query = {$or:[{createBy: 'root'}, {$and:[{school: schoolId}, {shared: true}]}]};
            query = encodeURIComponent(JSON.stringify(query));
            $http({
                method: "GET",
                url: "/files?query=" + query +"&populate=semester,subject,owner,school"
            }).success(function (files) {
                defered.resolve(files);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;

        };

        var getSharedFilesBySubject = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files?shared=true&subject=" + subjectId + "&populate=semester"
            }).success(function (files) {
                defered.resolve(files);
                console.log(files);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };


        var getSharedFilesBySubjectCount = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files/count?shared=true&subject=" + subjectId
            }).success(function (count) {
                defered.resolve(count.count);
                //console.log(files);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getSharedFilesBySubjectAndSemester = function(subjectId, semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files?shared=true&subject=" + subjectId + "&semester=" + semesterId
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getSharedFilesBySubjectAndSemesterAndSchool = function(subjectId, semesterId, schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            var query = {$or:[{createBy: 'root'}, {$and:[{school: schoolId}, {shared: true}]}], subject: subjectId, semester: semesterId};
            query = encodeURIComponent(JSON.stringify(query));
            $http({
                method: "GET",
                url: "/files?query=" + query
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };



        var getSharedFilesBySubjectAndSemesterCount = function(subjectId, semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/files/count?shared=true&subject=" + subjectId + "&semester=" + semesterId
            }).success(function (count) {
                defered.resolve(count.count);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var changeFileLike = function (fileId, teacherId, value) {
            if (value) {
                return $http({
                    method: "PUT",
                    url: "/files/" + fileId,
                    data: {
                        $push : {like: teacherId}
                    }
                })
            }else {
                return $http({
                    method: "PUT",
                    url: "/files/" + fileId,
                    data: {
                        $pull : {like: teacherId}
                    }
                })
            }

        };


        return {
            getFile: getFile,
            getAllFiles: getAllFiles,
            deleteFile: deleteFile,
            deleteFileFromFolder: deleteFileFromFolder,
            editFileNameAndDescription: editFileNameAndDescription,
            downloadFile: downloadFile,
            addDescription: addDescription,
            changeShareOption: changeShareOption,
            getSharedFilesBySchool: getSharedFilesBySchool,
            getSharedFilesBySubject: getSharedFilesBySubject,
            getSharedFilesBySubjectCount: getSharedFilesBySubjectCount,
            getSharedFilesBySubjectAndSemester: getSharedFilesBySubjectAndSemester,
            getSharedFilesBySubjectAndSemesterAndSchool: getSharedFilesBySubjectAndSemesterAndSchool,
            getSharedFilesBySubjectAndSemesterCount: getSharedFilesBySubjectAndSemesterCount,
            changeFileLike: changeFileLike

        };
    }]);
