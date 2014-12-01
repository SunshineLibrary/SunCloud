angular.module('schoolManage')
    .factory('RoomDataProvider', ['$http', '$q', function ($http, $q) {

        var createAdminRoom = function (info) {
            return $http({
                method: "POST",
                url: "/rooms",
                data: {
                    "name": info.name,
                    "school": info.school,
                    "type": 'admin',
                    "students": [],
                    "teachers": []
                }
            })
        };

        var createTeachingRoom = function (info) {
            return $http({
                method: "POST",
                url: "/rooms",
                data: {
                    "name": info.name,
                    "school": info.school,
                    "type": 'teaching',
                    "students": [],
                    "teachers": [info.me]
                }
            })
        };


        var getRoom = function (roomId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/" + roomId
            }).success(function(room){
                defered.resolve(room);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getRoomFull = function (roomId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/" + roomId + "?populate=teachers,students"
            }).success(function(room){
                defered.resolve(room);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getStudentsOfRoom = function(roomId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/" + roomId + "?populate=students"
            }).success(function(room){
                defered.resolve(room);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getRoomsBySchool = function (schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?school=" + schoolId + "&populate=teachers"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAdminRoomsBySchool = function (schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?school=" + schoolId + "&type=admin"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAdminRoomsFullBySchool = function (schoolId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?school=" + schoolId + "&type=admin&populate=students"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getRoomsByTeacher = function (teacherId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?teachers=" + teacherId + "&populate=students"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getRoomsFullByTeacher = function (teacherId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?teachers=" + teacherId + "&populate=students"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getTeachingRoomsFullByTeacher = function (teacherId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?teachers=" + teacherId + "&type=teaching&populate=students"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };


        var getRoomsByStudent = function (studentId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/?students=" + studentId + "&populate=school"
            }).success(function(rooms){
                defered.resolve(rooms);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getCountsOfRoomsBySchool = function (schoolId, callBack) {
            return $http({
                method: "GET",
                url: "/rooms/count?school=" + schoolId
            }).success(function(count){
                callBack(count)
            }).error(function(err){
                console.log(err);
            })
        };

        var editRoom = function (room) {
            return $http({
                method: "PUT",
                url: "/rooms/" + room._id,
                data: room
            })
        };
        var editRoomCode = function (roomId, newCode) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    code: newCode
                }
            })
        };

        var editRoomName = function(roomId, newName) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    name: newName
                }
            })
        };

        var deleteRoom = function (roomId) {
            return $http({
                method: "DELETE",
                url: "/rooms/" + roomId
            })
        };

        var removeStudentFromRoom = function(roomId, studentId) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $pull: {students: studentId}
                }
            })
        };

        var removeTeacherFromRoom = function(roomId, teacherId) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $pull: {teachers: teacherId}
                }
            })
        };

        var addStudentsToRoom = function(roomId, students) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $push: {students: {$each: students}}
                }
            })
        };

        var addTeachersToRoom = function(roomId, teachers) {
            //var teachersNow = room.teachers;
            //    teachersNow = teachersNow.concat(teachers);
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $push: {teachers: {$each: teachers}}
                }
            })
        };

        return {
            createAdminRoom: createAdminRoom,
            createTeachingRoom: createTeachingRoom,
            getRoom: getRoom,
            getRoomFull: getRoomFull,
            getStudentsOfRoom: getStudentsOfRoom,
            getRoomsBySchool: getRoomsBySchool,
            getAdminRoomsBySchool: getAdminRoomsBySchool,
            getAdminRoomsFullBySchool: getAdminRoomsFullBySchool,
            getRoomsByTeacher: getRoomsByTeacher,
            getRoomsFullByTeacher: getRoomsFullByTeacher,
            getTeachingRoomsFullByTeacher: getTeachingRoomsFullByTeacher,
            getRoomsByStudent: getRoomsByStudent,
            getCountsOfRoomsBySchool: getCountsOfRoomsBySchool,
            editRoom: editRoom,
            editRoomCode: editRoomCode,
            editRoomName: editRoomName,
            deleteRoom: deleteRoom,
            removeStudentFromRoom: removeStudentFromRoom,
            removeTeacherFromRoom: removeTeacherFromRoom,
            addStudentsToRoom: addStudentsToRoom,
            addTeachersToRoom: addTeachersToRoom,
        };
    }]);
