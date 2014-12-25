'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$state', '$rootScope', '$location',
	function($scope, Authentication, Menus, $state, $rootScope, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.$state = $state;
		$scope.user = Authentication.user;
		console.log($scope.user);

		if(!$scope.user) {
			$location.path('/signin');
		}


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});


	}
]);
