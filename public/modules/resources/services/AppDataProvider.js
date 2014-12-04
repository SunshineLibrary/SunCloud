angular.module('resources')
    .factory('AppDataProvider', ['$http', '$q', function ($http, $q) {

        var getApp = function(appId) {
            var defered = $q.defer();
            var appPromise = defered.promise;
            $http({
                method: "GET",
                url: "/apps/" + appId
            }).success(function(app){
                defered.resolve(app);
            }).error(function(err){
                defered.reject(err);
            });
            return appPromise;
        };

        var getAllApps = function (callBack) {
            var defered = $q.defer();
            var appsPromise = defered.promise;
            $http({
                method: "GET",
                url: "/apps"
            }).success(function (apps) {
                defered.resolve(apps);
                if(callBack){
                    callBack(apps);
                }
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return appsPromise;
        };

        var getAllRootApps = function (callBack) {
            var defered = $q.defer();
            var appsPromise = defered.promise;
            $http({
                method: "GET",
                url: "/apps?create_by=root"
            }).success(function (apps) {
                if(callBack){
                    callBack(apps);
                }
                defered.resolve(apps);
            }).error(function (err) {
                console.error(err);
                defered.reject(err);
            });
            return appsPromise;
        };

        var getAppsBySchool = function (schoolId) {
            var defered = $q.defer();
            var appsPromise = defered.promise;
            var query = {$or: [{create_by: 'root'}, {$and: [{shared: true},{school: schoolId}]}]};
            //$or=[{\"create_by\":\"root\"},{\"$and\",[{\"create_by\":\"admin\"},{\"school\":\"schoolId\"}]}]
            $http({
                method: "GET",
                url: "/apps",
                qs: { query: encodeURIComponent(JSON.stringify(query))}
                //url: "/apps?query={\"$or\": [{\"create_by\": \"root\"}, {\"$and\": [{\"create_by\": \"admin\"},{\"school\":"+ schoolId+"}]}]}"
            }).success(function (apps) {
                defered.resolve(apps);
            }).error(function (err) {
                defered.reject(err);
                console.error(err)
            });
            return appsPromise;
        };

        var getAppsByTeacher = function (teacherId, schoolId) {
            var defered = $q.defer();
            var appsPromise = defered.promise;
            var query = {$or: [{create_by: 'root'},{$and: [{create_by: 'teacher', teacher: teacherId},{}]}, {$and: [{shared: true},{school: schoolId}]}]};
            $http({
                method: "GET",
                url: "/apps",
                qs: { query: encodeURIComponent(JSON.stringify(query))}
                //url: "/apps?$or=[{create_by=root},{create_by=admin},{$and=[{create_by=teacher},{teacher=teacherId}]}]"
            }).success(function (apps) {
                defered.resolve(apps);
            }).error(function (err) {
                console.error(err);
                defered.reject(err);
            });
            return appsPromise;
        };

        var getAppsByRoom = function (roomId) {
            var defered = $q.defer();
            var appsPromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/" + roomId + "?populate=apps"
            }).success(function(room) {
                defered.resolve(room.apps);
            }).error(function(err){
                console.error(err);
                defered.reject(err);
            });
            return appsPromise;
        };

        var createApp = function(appName, user, role) {
            var appData = {};
            appData.name = appName;
            appData.created_at = Date.now();

            if(role === 'root') {
                appData.create_by = 'root'
            }else if(role === 'admin'){
                appData.create_by = 'admin';
                appData.school = user.school;
            }else {
                appData.create_by = 'teacher';
                appData.school = user.school;
                appData.teacher = user._id;
            }
            return $http({
                method: "POST",
                url: "/apps",
                data: appData
            })
        };

        var updateApp = function(appInfo) {
            return $http({
                method: "PUT",
                url: "/apps/" + appInfo._id,
                data: appInfo
            });
        };

        var deleteApp = function(appId) {
            return $http({
                method: "DELETE",
                url: "/apps/" + appId
            })
        };

        var addAppToRooms = function(appId, assignment) {
            return $http({
                method: "PUT",
                url: "/assign/apps",
                data: {
                    assignments: assignment,
                    appId: appId
                }
            })
        };

        var addAppToRoom = function(appId, roomId) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $push: {apps: appId}
                }
            })
        };

        var removeAppFromRoom = function(appId, roomId) {
            return $http({
                method: "PUT",
                url: "/rooms/" + roomId,
                data: {
                    $pull: {apps: appId}
                }
            })
        };


        var deleteAppFromRooms = function(app, rooms) {
            var roomTemp = _.difference(app.rooms, rooms);
            return $http({
                method: "PUT",
                url: "/apps/" + app._id,
                data: {
                    rooms: roomTemp
                }
            })
        };

        var deleteApk = function(app, apkId) {
            var apks = _.filter(app.apks, function(apk) {
                return apk._id !== apkId;
            });
            console.log(apks);
            var packageName = (apks.length === 0) ? null: app.package;
          return $http({
              method: "PUT",
              url: "/apps/" + app._id,
              data: {
                  apks: apks,
                  package: packageName
              }
          })
        };
        var editAppName = function(appId, newName) {
            $http({
                method: "PUT",
                url: "/apps/" + appId,
                data: {
                    name: newName
                }
            })
        };



        return {
            getApp: getApp,
            getAllApps: getAllApps,
            getAllRootApps: getAllRootApps,
            getAppsBySchool: getAppsBySchool,
            getAppsByTeacher: getAppsByTeacher,
            getAppsByRoom: getAppsByRoom,
            createApp: createApp,
            updateApp: updateApp,
            deleteApp: deleteApp,
            addAppToRooms: addAppToRooms,
            addAppToRoom: addAppToRoom,
            removeAppFromRoom: removeAppFromRoom,
            deleteAppFromRooms: deleteAppFromRooms,
            deleteApk: deleteApk
        };
    }]);
