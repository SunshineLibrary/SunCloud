angular.module('common')
    .factory('SubjectDataProvider', ['$http', '$q', function ($http, $q) {

        var getSubject = function(subjectId) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/subjects/" + subjectId
            }).success(function(subject){
                defered.resolve(subject);
            }).error(function(err){
                defered.reject(err);
            });
            return thePromise;
        };

        var getAllSubjects = function () {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "GET",
                url: "/subjects"
            }).success(function (subjects) {
                defered.resolve(subjects);
            }).error(function (err) {
                defered.reject(err);
                console.log(err);
            });
            return thePromise;
        };

        var createSubject = function(name) {
            return $http({
                method: "POST",
                url: '/subjects',
                data: {
                    name: name
                }
            })
        };

        var editSubject = function(info) {
            var defered = $q.defer();
            var thePromise = defered.promise;
            $http({
                method: "PUT",
                url: '/subjects/' + info._id,
                data: {
                    name: info.name
                }
            }).success(function(){
                defered.resolve(true);
            }).error(function(err){
                console.error(err);
                defered.reject('科目已存在');
            });
            return thePromise;
        };

        var deleteSubject = function(subjectId) {
            return $http({
                method: "DELETE",
                url: '/subjects/' + subjectId
            })
        };


        return {
            getSubject: getSubject,
            getAllSubjects: getAllSubjects,
            createSubject: createSubject,
            editSubject: editSubject,
            deleteSubject: deleteSubject

        };
    }]);
