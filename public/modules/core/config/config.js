'use strict';

var HTTPInterceptor = function($q, $location) {
    return {
        request: function(request) {
            return request;
        },
        requestError: function(request) {
            return $q.reject(request)
        },
        response: function(response) {
            return response;
        },
        responseError: function(response) {
            if(response.status === 401){
                $location.path('/#/signin');
            }
            console.log(response.status);
            return $q.reject(response);
        }
    }
};

angular.module('core').config(function($httpProvider) {
        $httpProvider.interceptors.push(HTTPInterceptor)
    }
).run(function($rootScope, $state, $stateParams) {
        //$rootScope.$state = $state;
        //$rootScope.$stateParams = $stateParams;

        //$rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
        //// to be used for back button //won't work when page is reloaded.
        ////$rootScope.previousState_name = fromState.name;
        ////$rootScope.previousState_params = fromParams;
        //
        //
        //});
    //back button function called from back button's ng-click="back()"
        $rootScope.back = function() {
        //$state.go($rootScope.previousState_name,$rootScope.previousState_params);
            window.history.back();

    };
}).run(function(amMoment) {
    amMoment.changeLocale('zh-cn');})
    .constant('angularMomentConfig', {
        timezone: 'Beijing' // e.g. 'Europe/London'
    });


