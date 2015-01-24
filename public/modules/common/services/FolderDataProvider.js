angular.module('common')
    .factory('FolderDataProvider', ['$http', '$q', function ($http, $q) {

        var getFolder = function(folderId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/" + folderId + "?populate=files,semester,subject"
            }).success(function(folder){
                defered.resolve(folder);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getFolderMin = function(folderId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/" + folderId + "?populate=subject,semester"
            }).success(function(folder){
                defered.resolve(folder);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAllFolders = function () {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?populate=subject,semester,owner,school"
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getFoldersByTeacherAndSubject = function(teacherId, subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?owner=" + teacherId + "&subject=" + subjectId + "&populate=semester"
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getFoldersByTeacher = function(teacherId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?owner=" + teacherId + "&populate=subject,semester&sort=subject"
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;

        };

        var getFoldersCountByTeacherAndSubject = function(teacherId, subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/count?owner=" + teacherId + "&subject=" + subjectId
            }).success(function (counts) {
                defered.resolve(counts.count);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getFoldersByTeacherAndSubjectAndSemester = function(teacherId, subjectId,semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?owner=" + teacherId + "&subject=" + subjectId + "&semester=" + semesterId
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var createFolder = function(info) {
            return $http({
                method: "POST",
                url: "/folders",
                data: {
                    name: info.name,
                    subject: info.subject,
                    semester: info.semester,
                    owner: info.owner,
                    school: info.school,
                    created_at: Date.now()
                }
            })
        };

        var addFolderToRooms = function(folderId, assignment) {
            return $http({
                method: "POST",
                url: "/assign/sunpack",
                data: {
                    assignments: assignment,
                    folderId: folderId
                }
            })
        };


        var editFolderName = function(info) {
            return $http({
                method: "PUT",
                url: "/folders/" + info._id,
                data: {
                    name: info.name,
                    updated_at: Date.now()
                }
            })
        };

        var editFolderNameAndSemester = function(info) {
            return $http({
                method: "PUT",
                url: "/folders/semester/" + info._id,
                data: {
                    name: info.name,
                    semester: info.semester,
                    updated_at: Date.now()
                }
            })
        };

        var deleteFolder = function(folderId) {
            return $http({
                method: "DELETE",
                url: "/folders/" + folderId
            })
        };

        var getSharedFoldersBySubject = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?subject=" + subjectId
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getSharedFoldersBySubjectCount = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/count?subject=" + subjectId
            }).success(function (count) {
                defered.resolve(count.count);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getSharedFoldersBySubjectAndSemester = function(subjectId, semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders?subject=" + subjectId + "&semester=" + semesterId
            }).success(function (folders) {
                defered.resolve(folders);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var getSharedFoldersBySubjectAndSemesterCount = function(subjectId, semesterId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/count?subject=" + subjectId + "&semester=" + semesterId
            }).success(function (count) {
                defered.resolve(count.count);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };


        var addFileToFolder = function(folderId, fileId) {
            return $http({
                method: "PUT",
                url: "/folders/" + folderId,
                data: {
                    $push: {files: fileId}
                }
            })
        };
        return {
            getFolder: getFolder,
            getFolderMin: getFolderMin,
            getAllFolders: getAllFolders,
            getFoldersByTeacherAndSubject: getFoldersByTeacherAndSubject,
            getFoldersByTeacher: getFoldersByTeacher,
            getFoldersCountByTeacherAndSubject: getFoldersCountByTeacherAndSubject,
            createFolder: createFolder,
            addFolderToRooms: addFolderToRooms,
            editFolderName: editFolderName,
            editFolderNameAndSemester: editFolderNameAndSemester,
            deleteFolder: deleteFolder,
            getSharedFoldersBySubject: getSharedFoldersBySubject,
            getSharedFoldersBySubjectCount: getSharedFoldersBySubjectCount,
            getSharedFoldersBySubjectAndSemester: getSharedFoldersBySubjectAndSemester,
            getSharedFoldersBySubjectAndSemesterCount: getSharedFoldersBySubjectAndSemesterCount,
            getFoldersByTeacherAndSubjectAndSemester: getFoldersByTeacherAndSubjectAndSemester,
            addFileToFolder: addFileToFolder
        };
    }]);
