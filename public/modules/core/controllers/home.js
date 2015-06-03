'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location', 'RootDataProvider', 'SchoolDataProvider', 'TeacherDataProvider',
	function($scope, Authentication, $http, $location, RootDataProvider, SchoolDataProvider, TeacherDataProvider) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.temp = {};
		$scope.newSchool = {};
		var index = 0;
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
					sweetAlert({title: "修改密码成功", type: "success", timer: 1500 });
				}).error(function(response) {
					$scope.error = response.message;
					sweetAlert({title: "修改失败，请重试", text: $scope.error,type: "error"});
				});
			};

			if($scope.isRoot) {
				RootDataProvider.getAllSchools().then(function(schools) {
					$scope.schools = schools;
				});

				$scope.createSchool = function () {
					var info = {};
					info.name = $scope.newSchool.name;
					info.address = $scope.newSchool.address;
					info.serverUrl = $scope.newSchool.serverUrl;
					info.serverIP = $scope.newSchool.serverIP;
					info.code = $scope.newSchool.code;

					var admin = {};
					admin.name = $scope.newSchool.name;
					admin.username = $scope.newSchool.admin;
					admin.roles = ['admin'];

					SchoolDataProvider.createSchool(info)
						.success(function(school){
							$scope.schools.push(school);
							$scope.newSchool = {};
							$('#createSchoolDialog').modal('hide');
							admin.school = school._id;
							TeacherDataProvider.createTeacher(admin)
								.success(function(newUser) {
									sweetAlert({
										title: "创建学校成功",
										text: "学校管理员用户名为"+newUser.username+"\n默认密码为xiaoshu",
										type: "success",
										confirmButtonColor: "#2E8B57",
										confirmButtonText: "确定",
										closeOnConfirm: false })
								}).error(function(err){
									console.error(err);
									sweetAlert({
										title: "创建学校成功",
										text: "创建学校管理员账号失败，可能由于用户名已存在\n请去学校页面或修改学校中添加管理员",
										type: "warning",
										confirmButtonColor: "#DD6B55",
										confirmButtonText: "确定",
										closeOnConfirm: false })
								});

						}).error(function(err){
							console.error(err);
							sweetAlert('创建失败','请重试','error');
						});
				};

				$scope.showEditSchoolDialog = function(i) {
					$('#editSchoolDialog').modal('show');
					index = i;
					$scope.temp.newName = $scope.schools[index].name;
					$scope.temp.newCode = $scope.schools[index].code;
					$scope.temp.newAddress = $scope.schools[index].address;
					$scope.temp.newServerUrl = $scope.schools[index].serverUrl;
					$scope.temp.newServerIP = $scope.schools[index].serverIP;

				};
				$scope.editSchool = function() {
					var info = {};
					info._id = $scope.schools[index]._id;
					info.name = $scope.temp.newName;
					info.code = $scope.temp.newCode;
					info.address = $scope.temp.newAddress;
					info.serverUrl = $scope.temp.newServerUrl;
					info.serverIP = $scope.temp.newServerIP;
					SchoolDataProvider.editSchool(info)
						.success(function(editedSchool) {
							$scope.schools[index].name = editedSchool.name;
							$scope.schools[index].code = editedSchool.code;
							$scope.schools[index].address = editedSchool.address;
							$scope.schools[index].serverUrl = editedSchool.serverUrl;
							$scope.schools[index].serverIP = editedSchool.serverIP;
							$('#editSchoolDialog').modal('hide');
							sweetAlert({title: "修改成功", type: "success", timer: 1000 });
						})
						.error(function(err) {
							console.error(err);
							$scope.error = true;
							sweetAlert({title: "修改失败", text: "请重试", type: "error", timer: 2000 });
						})
				};
			}
		}else {
			$location.path('/signin');
		}
		// Focus state for append/prepend inputs
		$('.input-group').on('focus', '.form-control', function () {
			$(this).closest('.input-group, .form-group').addClass('focus');
		}).on('blur', '.form-control', function () {
			$(this).closest('.input-group, .form-group').removeClass('focus');
		});

	}
]);