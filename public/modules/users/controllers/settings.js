'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'myRooms', 'RoomDataProvider',
	function($scope, $http, $location, Users, Authentication, myRooms, RoomDataProvider) {
		$scope.user = Authentication.user;
		$scope.myRooms = myRooms;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		$scope.$watch('myRooms', function(newRooms) {
			RoomDataProvider.getAdminRoomsBySchool($scope.user.school).then(function(rooms){
				console.log(rooms);
				$scope.roomList = _.filter(rooms, function(room) {
					return !_.find($scope.myRooms, function(myRoom) {
						return myRoom._id === room._id;
					})
				});
				$scope.selectedRoom = $scope.roomList[0];
			});
			if (newRooms) {
				$scope.myRooms = newRooms;
				for (var index = 0; index < $scope.myRooms.length; index++) {
					var theRoom = $scope.myRooms[index];
					if (theRoom.students === undefined) {
						theRoom.students = [];
					}
				}
			}
		}, true);

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$('#editProfileDialog').modal('hide');
					swal({title: "修改个人资料成功", type: "success", timer: 1500 });
				}, function(response) {
					$scope.error = response.data.message;
					swal({title: "修改失败，请重试", text: $scope.error,type: "error"});
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
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

		$scope.claimRoom = function() {
			RoomDataProvider.addTeachersToRoom($scope.selectedRoom._id, [$scope.user._id])
				.success(function(newRoom){
					$scope.myRooms.push(newRoom);
					$('#claimRoomDialog').modal('hide');
					swal({title: "认领成功", type: "success", timer: 1500});
				})
				.error(function(err){
					console.error(err);
					swal({title: "认领失败", text: "请重试", type: "error", timer: 1500});
				})
		};
		// Focus state for append/prepend inputs
		$('.input-group').on('focus', '.form-control', function () {
			$(this).closest('.input-group, .form-group').addClass('focus');
		}).on('blur', '.form-control', function () {
			$(this).closest('.input-group, .form-group').removeClass('focus');
		});

	}
]);
