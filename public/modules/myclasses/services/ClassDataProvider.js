angular.module('myClasses')
    .factory('ClassDataProvider', ['$http', '$q', '$route', '$location', function ($http, $q, $route, $location) {
        var myClasses = undefined;

        var me = {};
        $.ajax({
            url: "/me",
            async: false,
            success: function (json) {
                me = json;
            },
            dataType: "json"
        });

        var getMyClasses = function (callBack) {
            var defered = $q.defer();
            var classesPromise = defered.promise;
            //UserDataProvider.getMe()
            $http({
                method: "GET",
                url: "/rooms?query={\"teachers.teacher\":\"" + me._id + "\"}"
            }).success(function (rooms) {
                myClasses = rooms;
                for(var classIndex = 0; classIndex < rooms.length; classIndex++){
                    rooms[classIndex].mySubject = $.grep(rooms[classIndex].teachers, function(e){ return e.teacher == me._id; })[0].subject;
                }

                if (callBack !== undefined) {
                    callBack(rooms);
                }
                defered.resolve(rooms);
                if (
                    ($route.current === undefined) ||
                    ($route.current.params === undefined) ||
                    ($route.current.params.classId === undefined) ||
                    ($route.current.params.classId.length !== 24) ||
                    (myClasses.length === 0)
                ) {
                    //jumpToFirst();
                } else {
                }
            }).error(function (err) {
            });
            return classesPromise;
        };

        var getAllClasses = function(callBack) {
            var defered = $q.defer();
            var classListPromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms?school=" + me.school
            }).success(function(classList){
                callBack(classList);
                defered.resolve(classList);
            }).error(function(err){
                console.log(err);
            });
            return classListPromise;
        };

        var getAllSubjects = function(callBack) {
            var defered = $q.defer();
            var subjectListPromise = defered.promise;
            $http({
                method: "GET",
                url: "/subjects"
            }).success(function(subjectList){
                callBack(subjectList);
                defered.resolve(subjectList);
            }).error(function(err){
                console.log(err);
            });
            return subjectListPromise;
        };

        var getClass = function (classId, callBack) {
            var defered = $q.defer();
            var classPromise = defered.promise;
            $http({
                method: "GET",
                url: "/rooms/" + classId + "?populate=students"
            }).success(function (theClass) {
                if (callBack) {
                    callBack(theClass);
                }
                defered.resolve(theClass);
            }).error(function (err) {
                console.log('fail!' + err);

            });
            return classPromise;
        };

        var createClass = function (name, callBack) {
            $http({
                method: "POST",
                url: "/rooms",
                data: {
                    "name": name,
                    "school": me.school,
                    "teachers": [{teacher: me._id}]
                }
            }).success(function (newClass) {
                myClasses.push(newClass);
                $location.path('myclasses/' + newClass._id);
                callBack(newClass);
            }).error(function (err) {
            });
        };

        var claimClass = function(classId, subjectId, callBack) {
            $http({
                method: "PUT",
                url: "/rooms/" + classId._id,
                data:{
                    //"teachers" : [{"teacher": me._id, "subject": subjectId._id}]
                    $push: {"teachers":{"teacher": me._id, $push:{"subject": subjectId.name}}}
                }
            //{$push: {"teachers": {"teacher": me._id}}}
                    //"teachers" : [{"subject": subjectId._id, "teacher": me._id} ]
                    //"teachers":{$push: {$push:{"subject": subjectId._id}, "teacher": me._id}}

            }).success(function (newClass){
                myClasses.push(newClass);
                console.log(newClass);
                $location.path('myclasses/' + newClass._id);
                callBack(newClass);
            }).error(function(err){
                console.log(err)
            })
        };

        var disbandClass = function (classId, callBack) {
            $http({
                method: "DELETE",
                url: "/rooms/" + classId
            }).success(function (oldClass) {
                for (var classIndex = 0; classIndex < myClasses.length; classIndex++) {
                    if (myClasses[classIndex]._id === classId) {
                        myClasses.splice(classIndex, 1);
                        break;
                    }
                }
                callBack(oldClass);
            }).error(function (err) {
//                var jump = confirm(err + '\n可能需要以管理员登录，是否打开登录页面？\n登录后请刷新页面。');
//                if (jump) {
//                    window.open('/webapp/login/#/login', window.name, '_blank');
//                }
            });
        };

        var editClass = function (editedClass, classId, callBack) {
            $http({
                method: "PUT",
                data: editedClass,
                url: "/rooms/" + classId
            }).success(function (newClass) {
                for (var classIndex = 0; classIndex < myClasses.length; classIndex++) {
                    var theClass = myClasses[classIndex];
                    if (theClass._id === newClass._id) {
                        theClass = newClass;
                        break;
                    }
                }
                callBack(newClass);
            }).error(function (err) {
                console.log('Edit Class Error: '+angular.toJson(err));
//                var jump = confirm(err + '\n可能需要以管理员登录，是否打开登录页面？\n登录后请刷新页面。');
//                if (jump) {
//                    window.open('/webapp/login/#/login', window.name, '_blank');
//                }
            });
        };

        var jumpToFirst = function () {
            if ((myClasses) && (myClasses.length > 0)) {
                $location.path('myclasses/' + myClasses[0]._id);
            } else {
                $location.path('/');
            }
        };


        return {
            getMyClasses: getMyClasses,
            getAllClasses: getAllClasses,
            getAllSubjects: getAllSubjects,
            createClass: createClass,
            claimClass: claimClass,
            disbandClass: disbandClass,
            getClass: getClass,
            //getClassMin: getClassMin,
            editClass: editClass,
            jumpToFirst: jumpToFirst
        };
    }]);
