angular.module('common')
    .factory('RoomDataProvider', ['$http', '$q', function ($http, $q) {

        var createAdminRoom = function (info) {
            return $http({
                method: "POST",
                url: "/rooms",
                data: {
                    "name": info.name,
                    "school": info.school,
                    "code": info.code,
                    "type": 'admin',
                    "students": [],
                    "teachers": [],
                    "apps": [],
                    "sunpack": []
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
                    "teachers": [info.me],
                    "apps": [],
                    "sunpack": []
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
                url: "/rooms/" + roomId + "?populate=teachers,students,school"
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
                url: "/rooms?teachers=" + teacherId
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

        var getMyRooms = function(me) {
            var defered = $q.defer();
            var query;
            if(me.roles.indexOf('teacher') > -1 && me.roles.indexOf('admin') > -1  ) {
                query = {$or: [{school: me.school}, {$and: [{type: 'teaching'},{teachers: me._id}]}]};
                console.log('teacher and admin')
            }else if(me.roles.indexOf('admin') > -1) {
                query = {school: me._id, type: 'admin'};
                console.info('only admin');
            }else {
                query = {"teachers": me._id};
                console.log(me._id);
                console.info('only teacher');
            }
            query = encodeURIComponent(JSON.stringify(query));
            //"{\"teachers\":\"5475817d24936fad47c7c74d\"}"
            $http({
                method: "GET",
                url: "/rooms?query=" + query
                //params: { query: encodeURIComponent(JSON.stringify(query))}
            }).success(function(rooms) {
                defered.resolve(rooms);
            }).error(function(err) {
                defered.reject(err);
            });
            return defered.promise;
        };


        var getRoomsByStudent = function (studentId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/?students=" + studentId + "&type=admin"
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
                callBack(null, count.count)
            }).error(function(err){
                console.log(err);
                callBack(err);
            })
        };

        var editRoomNameAndCode = function (room) {
            return $http({
                method: "PUT",
                url: "/rooms/" + room._id,
                data: {
                    name: room.name,
                    code: room.code
                }
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

        var getFoldersByRoom = function(roomId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/room/" + roomId
            }).success(function(folders) {
                defered.resolve(folders);
            }).error(function(err){
                console.error(err);
                defered.reject(err);
            });
            return thePromise;
        };

        var getFoldersByRoomAndTeacher = function(roomId, teacherId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/folders/room/" + roomId + '/teacher/' + teacherId
            }).success(function(folders) {
                defered.resolve(folders);
            }).error(function(err){
                console.error(err);
                defered.reject(err);
            });
            return thePromise;
        };

        var getFoldersCountByRoomAndTeacher = function(roomId, teacherId) {
            return $http({
                method: "GET",
                url: "/count/folders/room/" + roomId + '/teacher/' + teacherId
            })
        };

        var addFoldersToRoom = function(roomId, folderIds) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $push: {sunpack: {$each: folderIds}}
                }
            })
        };

        var removeFolderFromRoom = function(roomId, folderId) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $pull: {sunpack: folderId}
                }
            })
        };
        //
        //var getFoldersOfMyRooms = function(teacherId) {
        //    var defered = $q.defer();
        //    var thePromise = defered.promise;
        //    $http({
        //        method: "GET",
        //        url: "/rooms/" + roomId + "?populate=teachers,students,school"
        //    }).success(function(room){
        //        defered.resolve(room);
        //    }).error(function(err){
        //        defered.reject(err);
        //    });
        //    return thePromise;
        //};

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
            editRoomNameAndCode: editRoomNameAndCode,
            editRoomCode: editRoomCode,
            editRoomName: editRoomName,
            deleteRoom: deleteRoom,
            removeStudentFromRoom: removeStudentFromRoom,
            removeTeacherFromRoom: removeTeacherFromRoom,
            addStudentsToRoom: addStudentsToRoom,
            addTeachersToRoom: addTeachersToRoom,
            getMyRooms: getMyRooms,
            getFoldersByRoom: getFoldersByRoom,
            getFoldersByRoomAndTeacher: getFoldersByRoomAndTeacher,
            getFoldersCountByRoomAndTeacher: getFoldersCountByRoomAndTeacher,
            addFoldersToRoom: addFoldersToRoom,
            removeFolderFromRoom: removeFolderFromRoom

        };
    }]);
