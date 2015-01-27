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
            return $http({
                method: "PUT",
                url: '/subjects/' + info._id,
                data: {
                    name: info.name
                }
            })
        };

        var deleteSubject = function(info) {
            return $http({
                method: "DELETE",
                url: '/subjects/' + info._id
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
