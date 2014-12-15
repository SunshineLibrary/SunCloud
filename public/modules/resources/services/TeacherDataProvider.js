angular.module('schoolManage')
    .factory('TeacherDataProvider', ['$http', '$q', '$route',function ($http, $q, $route) {
        var getTeachersBySchool = function(schoolId, callBack) {
            var defered = $q.defer();
            var teachersBySchoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users?roles=teacher&school=" + schoolId
            }).success(function(teachers) {
                defered.resolve(teachers);
                if(callBack) {
                    callBack(teachers);
                }
            }).error(function (err) {
                console.error(err);
            });
            return teachersBySchoolPromise;
        };


        var getAdminsBySchool = function(schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/users?school=" + schoolId + '&roles=admin'
            }).success(function (school) {
                defered.resolve(school);
            }).error(function (err) {
                console.error(err);
                defered.reject(err);
            });
            return thePromise;
        };
        //
        //var getNotAdminsBySchool = function(schoolId) {
        //    var defered = $q.defer();
        //    var thePromise = defered.promise;
        //    $http({
        //        method: "GET",
        //        url: "/users?school=" + schoolId + '&roles=admin'
        //    }).success(function (school) {
        //        defered.resolve(school);
        //    }).error(function (err) {
        //        console.error(err);
        //        defered.reject(err);
        //    });
        //    return thePromise;
        //};

        var getCountsOfTeachersBySchool = function(schoolId, callBack){
            $http({
                method: "GET",
                url: "/users/count?roles=teacher&school=" + schoolId
            }).success(function(counts){
                callBack(null, counts.count);
            }).error(function(err){
                console.error(err);
                callBack(err);
            });
        };

        var createTeacher = function (info) {
            return $http({
                method: "POST",
                url: "/users",
                data: info
            })
        };
        var getTeacher = function (teacherId, callBack) {
            var defered = $q.defer();
            var teacherPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users/" + teacherId + "?populate=school"
            }).success(function (teacher) {
                defered.resolve(teacher);
                if(callBack) {
                    callBack(teacher);
                }
            }).error(function (err) {
                console.error(err);
                defered.reject(err);
            });
            return teacherPromise;
        };
        var editTeacher = function (teacher) {
            return $http({
                method: "PUT",
                url: "/users/" + teacher._id,
                data: teacher
            })
        };

        var editTeacherPermission = function(teacherId, canCreateApp) {
            return $http({
                method: "PUT",
                url: "/users/" + teacherId,
                data: {
                    canCreateApp: canCreateApp
                }
            })
        };

        var editTeacherRole = function(teacherId, roles) {
            return $http({
                method: "PUT",
                url: "/users/" + teacherId,
                data: {
                    roles: roles
                }
            })
        };

        var deleteTeacher = function (teacherId) {
            return $http({
                method: "DELETE",
                url: "/users/" + teacherId
            })
        };

        var getRoomsOfTeacher = function (teacherId) {
            return $http({
                method: "GET",
                url: "/rooms?teachers=" + teacherId
            })
        };

        /**
         * reset password to xiaoshu
         * @param teacherId
         * @returns {*}
         */
        var resetPassword = function(teacherId) {
          return $http({
              method: "POST",
              url: "/password/reset",
              data: {
                  teacherId: teacherId
              }
          })
        };
        return {
            getTeachersBySchool: getTeachersBySchool,
            getAdminsBySchool: getAdminsBySchool,
            getCountsOfTeachersBySchool: getCountsOfTeachersBySchool,
            createTeacher: createTeacher,
            getTeacher: getTeacher,
            editTeacher: editTeacher,
            editTeacherPermission: editTeacherPermission,
            editTeacherRole: editTeacherRole,
            deleteTeacher: deleteTeacher,
            getRoomsOfTeacher: getRoomsOfTeacher,
            resetPassword: resetPassword
        };
    }]);
