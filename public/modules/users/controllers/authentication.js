'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) {
			$location.path('/');
		}else {
			$location.path('/auth/signin');
		}


		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$('[data-toggle="tooltip"]').tooltip();
		$('[data-toggle="popover"]').popover();

		// Add style class name to a tooltips
		$('.tooltip').addClass(function () {
			if ($(this).prev().attr('data-tooltip-style')) {
				return 'tooltip-' + $(this).prev().attr('data-tooltip-style');
			}
		});

		// Focus state for append/prepend inputs
		$('.input-group').on('focus', '.form-control', function () {
			$(this).closest('.input-group, .form-group').addClass('focus');
		}).on('blur', '.form-control', function () {
			$(this).closest('.input-group, .form-group').removeClass('focus');
		});



	}
]);
