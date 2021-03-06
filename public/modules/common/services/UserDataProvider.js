angular.module('common')
    .factory('UserDataProvider',
    [
        '$http',
        '$q',
        function
            ($http, $q) {

            var getTablet = function(userId) {
                var defered = $q.defer();
                var tabletPromise = defered.promise;
                $http({
                    method: "GET",
                    url: "/records?userId=" + userId + "&logout_at&populate=tabletId"
                }).success(function(theTablet){
                    defered.resolve(theTablet);
                }).error(function(err){
                    console.error(err);
                    defered.reject(err);
                });
                return tabletPromise;
            };

            var getTabletHistory = function(studentId) {
                var defered = $q.defer();
                var tabletPromise = defered.promise;
                $http({
                    method: "GET",
                    url: "/records?userId=" + studentId + "&populate=tabletId"
                }).success(function(theTablet){
                    defered.resolve(theTablet);
                }).error(function(err){
                    console.error(err);
                    defered.reject(err);
                });
                return tabletPromise;

            };

            var getUser = function(tabletId, callBack){
                var defered = $q.defer();
                var userPromise = defered.promise;
                $http({
                    method: "GET",
                    url: "/records?tabletId=" + tabletId + "&logout_at&populate=userId"
                }).success(function(theUser){
                    if(callBack){
                        callBack(theUser);
                    }
                    defered.resolve(theUser);
                }).error(function(err){
                    console.error(err);
                });
                return userPromise;
            };


            var login = function (password, callBack) {
                $http({
                    method: 'POST',
                    url: '/login',
                    data: {
                        username: me.username,
                        password: password
                    }
                }).success(function () {
                    callBack(true);
                }).error(function (err) {
                    callBack(false, err);
                });
            };

            var getStudentsId = function(length, class_number) {
                var results = [];
                var id = '';
                for(var i=1; i<=length; i++) {
                    if(i<10) {
                        id = class_number+'0'+i;
                    }else{
                        id = class_number+i;
                    }
                    results.push(id);
                }
                return results;
            };



            var generateStudentInstance = function(ids, names) {
                var results = [];
                if(names) {
                    _.each(names, function(user_name, index) {
                        var user = {};
                        user.username = ids[index];
                        user.password = user.usernames;
                        user.roles = ['student'];
                        user.name = user_name;
                        user.have_profile = false;
                        results.push(user);
                    });
                    return results;
                }else if(ids) {
                    _.each(ids, function(userId) {
                        var user = {};
                        user.username = userId;
                        user.password = user.username;
                        user.roles = ['student'];
                        user.have_profile = false;
                        results.push(user);
                    });
                    return results;
                }
            };

            var sendPostJoinUsers = function(users, classNum) {
                return $http.post('/join/students', {users: users, classNum: classNum});
            };

            var autoCreateStudents = function(users_count, class_number) {
                var usernames = getStudentsId(users_count, class_number);
                var users = generateStudentInstance(usernames);
                return sendPostJoinUsers(users, class_number);
            };

            var manualCreateStudents = function(names, class_number) {
                var usernames = getStudentsId(names.length, class_number);
                var users = generateStudentInstance(usernames, names);
                return sendPostJoinUsers(users, class_number);
            };

            var manualCreateSingleStudent = function(users, classNum) {
                return sendPostJoinUsers(users, classNum);
            };

            var editStudentName = function(student) {
                return $http.put('/users/'+student._id, {name: student.name});
            };

            var resetStudentPassword = function(student) {
                return $http.put('/users/'+student._id, {password: student.username});
            };

            return {
                login: login,
                getTablet: getTablet,
                getTabletHistory: getTabletHistory,
                getUser: getUser,
                autoCreateStudents: autoCreateStudents,
                manualCreateStudents: manualCreateStudents,
                manualCreateSingleStudent: manualCreateSingleStudent,
                editStudentName: editStudentName,
                resetStudentPassword: resetStudentPassword
            };
        }]);
