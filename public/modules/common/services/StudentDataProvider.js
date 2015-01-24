angular.module('common')
    .factory('StudentDataProvider', ['$http', '$q', function ($http, $q) {

        var getStudentsBySchool = function(schoolId) {
            var defered = $q.defer();
            var studentsBySchoolPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users?roles=student&school=" + schoolId
            }).success(function(students){
                defered.resolve(students);
            }).error(function(err) {
                defered.reject(err);
            });
            return studentsBySchoolPromise;
        };

        var getCountsOfStudentsBySchool = function(schoolId, callBack){
            $http({
                method: "GET",
                url: "/users/count?roles=student&school=" + schoolId
            }).success(function(counts) {
                if(callBack) {
                    callBack(null, counts.count);
                }
            }).error(function(err) {
                console.error(err);
                callBack(err);
            })
        };

        var createStudent = function (info) {
            return $http({
                method: "POST",
                url: "/users",
                data: info
            })
        };

        var createStudentBatch = function(studentsList) {
            return $http({
                method: "POST",
                url: "/students/batch",
                data: {
                    studentsList: studentsList
                }
            })
        };

        //var createStudentBatch = function (studentsList, callBack) {
        //    var successList = [];
        //    var failList = [];
        //    _.each(studentsList, function(student) {
        //        console.log(student);
        //        $.ajax({
        //            url: "/users",
        //            method: "POST",
        //            async: false,
        //            data: student,
        //            success: function (newStudent) {
        //                console.log(newStudent);
        //                successList.push(newStudent)
        //            },
        //            error: function(err) {
        //                console.error(err);
        //                failList.push(student)
        //            },
        //            dataType: "json"
        //        });
        //    });
        //    console.log('success:' + successList);
        //    console.log('fail: ' + failList);
        //    callBack(successList, failList);
        //
        //};

        var getStudent = function (studentId, callBack) {
            var defered = $q.defer();
            var studentPromise = defered.promise;
            $http({
                method: "GET",
                url: "/users/" + studentId + "?populate=school"
            }).success(function (student) {
                defered.resolve(student);
                if(callBack) {
                    callBack(student);
                }
            }).error(function (err) {
                console.error(err);
            });
            return studentPromise;
        };

        var editStudent = function (student) {
            return $http({
                method: "PUT",
                url: "/users/" + student._id,
                data: student
            })
        };

        var editStudentNameBirthday = function (student) {
            return $http({
                method: "PUT",
                url: "/users/" + student._id,
                data: {
                    name: student.name,
                    username: student.username,
                    birthday: student.birthday
                }
            })
        };

        var removeStudent = function (studentId) {
            return $http({
                method: "DELETE",
                url: "/users/" + studentId
            })
        };

        var getStudentRoom = function(studentId) {
            return $http({
                method: "GET",
                url: "/rooms?students=" + studentId
            })

        };

        var autoCreateAddStudents = function(schoolId, roomId, names) {
            return $http({
                method: "POST",
                url: "/students/auto",
                data: {
                    schoolId: schoolId,
                    roomId: roomId,
                    names: names
                }
            });
        };

        var manualCreateAddStudents = function(schoolId, roomId, students) {
            return $http({
                method: "POST",
                url: "/students/manual",
                data: {
                    schoolId: schoolId,
                    roomId: roomId,
                    students: students
                }
            })
        };

        return {
            getStudentsBySchool: getStudentsBySchool,
            getCountsOfStudentsBySchool: getCountsOfStudentsBySchool,
            createStudent: createStudent,
            createStudentBatch: createStudentBatch,
            autoCreateAddStudents: autoCreateAddStudents,
            manualCreateAddStudents: manualCreateAddStudents,
            getStudent: getStudent,
            editStudentNameBirthday: editStudentNameBirthday,
            editStudent: editStudent,
            removeStudent: removeStudent,
            getStudentRoom: getStudentRoom
        };
    }]);
