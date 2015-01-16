'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$state', '$location',
	function($scope, Authentication, Menus, $state, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.$state = $state;
		$scope.user = Authentication.user;

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

		//$('body').timeago('refresh');
		//$.fn.timeago.defaults.lang = {
		//	units: {
		//		second: "秒",
		//		seconds: "秒",
		//		minute: "分钟",
		//		minutes: "分钟",
		//		hour: "小时",
		//		hours: "小时",
		//		day: "天",
		//		days: "天",
		//		month: "月",
		//		months: "月",
		//		year: "年",
		//		years: "年"
		//	},
		//	prefixes: {
		//		lt: "不到 1",
		//		about: "大约",
		//		over: "超过",
		//		almost: "接近",
		//		ago: ""
		//	},
		//	suffix: "之前",
		//	now: '刚刚'
		//};

	}
]);
