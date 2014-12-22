angular.module('resources')
    .factory('FolderDataProvider', ['$http', '$q', function ($http, $q) {

        var getFolder = function(folderId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/" + folderId + "?populate=files,semester"
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
                url: "/folders"
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

        var createFolder = function(info) {
            return $http({
                method: "POST",
                url: "/folders",
                data: {
                    name: info.name,
                    subject: info.subject,
                    semester: info.semester,
                    owner: info.owner,
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

        var editFolderNameAndSemester = function(info) {
            return $http({
                method: "PUT",
                url: "/folders/" + info._id,
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
                url: "folders/" + folderId
            })
        };


        return {
            getFolder: getFolder,
            getAllFolders: getAllFolders,
            getFoldersByTeacherAndSubject: getFoldersByTeacherAndSubject,
            createFolder: createFolder,
            addFolderToRooms: addFolderToRooms,
            editFolderNameAndSemester: editFolderNameAndSemester,
            deleteFolder: deleteFolder
        };
    }]);
