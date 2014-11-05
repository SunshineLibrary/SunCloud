angular.module('schoolManage')
    .factory('StudentDataProvider', ['$http', '$q', "$route", function ($http, $q, $route) {

        var getStudentsBySchool = function(schoolId, callBack) {
            var defered = $q.defer();
            var studentsBySchoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users?roles=student&school=" + schoolId
            }).success(function(students){
                defered.resolve(students);
                callBack(students);
            }).error(function(err) {
                console.error(err);
            });
            return studentsBySchoolPromise;

        };

        var getCountsOfStudentsBySchool = function(schoolId, callBack){
            $http({
                method: "GET",
                url: "/users/count?roles=student&school=" + schoolId
            }).success(function(counts){
                callBack(counts);
            }).error(function(err){
                console.error(err);
            })
        };

        var createStudent = function (info) {//password will be the same as username!
            $http({
                method: "POST",
                url: "/users",
                data: {
                    "name": info.name,
                    "username": info.username,
                    "roles": ["student"]
                }
            }).success(function (student) {
                info.callBack(undefined,student);
            }).error(function (err) {
                if (err.message === 'Username already exists') {
                    info.callBack('Username already exists');
                } else {
                    console.error(err);
                }
            });
        };
        /**
         * TODO: NEED EDIT $route.current.params.studentId
         * @returns {jQuery.promise|promise.promise|promise|d.promise|.ready.promise|jQuery.ready.promise}
         */
        var getStudent = function () {
            var defered = $q.defer();
            var studentPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users/" + $route.current.params.studentId
            }).success(function (student) {
                defered.resolve(student);
            }).error(function (err) {
                console.error(err);
            });
            return studentPromise;
        };
        var editStudent = function (student, callBack) {
            $http({
                method: "PUT",
                url: "/users/" + $route.current.params.studentId,
                data: student
            }).success(function (student) {
                callBack(student);
            }).error(function (err) {
                console.error(err);
            });
        };
        var removeStudent = function (callBack) {
            $http({
                method: "DELETE",
                url: "/users/" + $route.current.params.studentId
            }).success(function (student) {
                callBack(student);
            }).error(function (err) {
                console.error(err);
            });
        };
        return {
            getStudentsBySchool: getStudentsBySchool,
            getCountsOfStudentsBySchool: getCountsOfStudentsBySchool,
            createStudent: createStudent,
            getStudent: getStudent,
            editStudent: editStudent,
            removeStudent: removeStudent
        };
    }]);
