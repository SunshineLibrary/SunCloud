'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$rootScope', '$http',
	function($scope, Authentication, $rootScope, $http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		//console.log($scope.user);
		//console.log($scope.user);
		if($scope.user) {
			$scope.isRoot = $scope.user.roles.indexOf('root') > -1;
			// Change user password
			$scope.resetPassword = function() {
				$scope.success = $scope.error = null;
				if($scope.passwordDetails.newPassword.toString() !== $scope.passwordDetails.verifyPassword.toString()) {
					$scope.error = "新密码与确认密码不一致， 请修改后重试";
					return;
				}

				$http.post('/users/password', $scope.passwordDetails).success(function(response) {
					// If successful show success message and clear form
					$scope.success = true;
					$scope.user.resetPassword = true;
					$scope.passwordDetails = null;
					$('#resetPasswordDialog').modal('hide');
					swal({title: "修改密码成功", type: "success", timer: 1500 });
				}).error(function(response) {
					$scope.error = response.message;
					swal({title: "修改失败，请重试", text: $scope.error,type: "error"});
				});
			};
		}

	}
]);