(function() {
    angular.module('core')

        .directive('feedbackButton',['$modal',function($modal){
            return {
                restrict: 'E',
                scope:{
                    pageInfo:'='
                },
                controller:['$scope','$http',function($scope,$http){

                    $scope.$watch('pageInfo', function(newVal) {
                        if(newVal) {
                            $scope.pageInfo = newVal;
                        }
                    }, true);

                    $scope.showFeedback = function(){
                        $scope.getUserInfo();
                    };

                    $scope.getUserInfo = function () {
                        //$scope.userInfo = {username: 'hello'};
                        //$scope.showModal();
                        $http.get('/me')
                            .success(function(userInfo) {
                                $scope.userInfo = userInfo;
                                $scope.showModal();
                            })
                            .error(function(err) {
                                $scope.userInfo = {username:'用户未登录'};
                                $scope.showModal();
                            })
                    };

                    $scope.showModal = function(){
                        var modalInstance = $modal.open({
                            template:
                            '<section data-ng-init="init()">' +
                            '<div class="modal-body">' +
                            '<button class="close fui-cross" data-ng-click="cancel()"></button>'+
                            '<br/>'+
                            '<div class="form-group">' +
                            '<label><strong style="color: red">* </strong>内容</label>' +
                            '<textarea type="text" rows="5" style="max-width: 100%" class="form-control" placeholder="请写下您在本页遇到的问题或建议" data-ng-model="material.content" ng-keyup="checkContentEmpty()"></textarea>' +
                            '<span class="error-msg" ng-show="checkStatus && contentSwitchOn">请填写内容</span>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label>联系方式</label>' +
                            '<input type="text" class="form-control" placeholder="手机 / 邮箱 / QQ" data-ng-model="userInfo.contact">' +
                            '<span class="error-msg" ng-show="checkStatus && contactSwitchOn">请输入正确的格式</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-success" ng-click="submit()">提交</button>' +
                            '</div>' +
                            '<show-json-button source="material" style="display:none"></show-json-button>'+
                            '</section>',

                            controller: ['$scope','$modalInstance','userInfo','pageInfo',function ($scope, $modalInstance,userInfo,pageInfo) {
                                var getUserDefaultContactInfo = function(){
                                    var ret = '';

                                    if(userInfo.phone!=null && userInfo.phone!=undefined) {
                                        ret = userInfo.phone;
                                    }

                                    if(userInfo.email!=null && userInfo.email!=undefined) {
                                        ret = userInfo.email;
                                    }
                                    return ret;
                                };

                                var validateUserContactInfo = function(){
                                    var ret = false;
                                    var regxQQ = /^[1-9][0-9]{3,9}$/;
                                    var regxPhone = /^1[3|4|5|7|8][0-9]\d{8}$/;
                                    var regxMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

                                    if(regxQQ.test($scope.userInfo.contact)||regxPhone.test($scope.userInfo.contact)||
                                        regxMail.test($scope.userInfo.contact)||$scope.userInfo.contact==''){
                                        ret = true;
                                        $scope.contactSwitchOn = false;
                                        if(regxQQ.test($scope.userInfo.contact)){
                                            console.log("----->QQ");
                                            $scope.material.contactInfo.qq = $scope.userInfo.contact;
                                        }else if(regxPhone.test($scope.userInfo.contact)){
                                            console.log("----->Phone");
                                            $scope.material.contactInfo.phone = $scope.userInfo.contact;
                                        }else if(regxMail.test($scope.userInfo.contact)){
                                            console.log("----->Mail");
                                            $scope.material.contactInfo.email = $scope.userInfo.contact;
                                        }
                                    }else{
                                        $scope.contactSwitchOn = true;
                                    }

                                    return ret;
                                };

                                $scope.init = function(){
                                    $scope.checkStatus = false;
                                    $scope.contentSwitchOn = false;
                                    $scope.contactSwitchOn = false;
                                    $scope.material = {};
                                    $scope.material.pageInfo = {};
                                    $scope.material.contactInfo = {};
                                    $scope.material.content = '';
                                    $scope.userInfo = {'contact':getUserDefaultContactInfo()};

                                    $scope.material.user = userInfo;
                                    $scope.material.pageInfo.url = window.location.href;
                                    //
                                    //if(pageInfo!=null && pageInfo!=undefined && pageInfo['activityType']!=null && pageInfo['activityType']!=undefined){
                                    //    if(pageInfo['activityType']=='video'){
                                    //        $scope.material.pageInfo.videoId = pageInfo.videoId;
                                    //    }else{
                                    //        $scope.material.pageInfo.problemId = pageInfo.problemId;
                                    //        $scope.material.pageInfo.problemBody = pageInfo.problemBody;
                                    //
                                    //    }
                                    //}
                                };

                                $scope.checkContentEmpty = function(){
                                    var ret = false;
                                    if($scope.material.content == ''){
                                        ret = true;
                                        $scope.contentSwitchOn = true;
                                    }else{
                                        $scope.contentSwitchOn = false;
                                    }
                                    return ret;
                                };

                                $scope.submit = function () {
                                    if(!validateUserContactInfo()){
                                        $scope.checkStatus = true;
                                        if($scope.checkContentEmpty()){  // 目的是为了两个输入框都检测
                                            $scope.checkStatus = true;
                                            return;
                                        }
                                        return;
                                    }

                                    if($scope.checkContentEmpty()){    // 当联系方式正确时，还要检测一下
                                        $scope.checkStatus = true;
                                        return;
                                    }

                                    $http.post('/feedbacks',$scope.material,{
                                        headers: {'Content-Type': 'application/json;charset=utf-8'}
                                    }).success(function(data, status, headers, config){
                                        console.log(data.message);
                                    }).error(function(){
                                        console.log('mail send fail');
                                    }).then(function(){
                                        $modalInstance.close('thankYou');
                                    });
                                };
                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };
                            }],

                            resolve: {
                                userInfo: function () {
                                    return $scope.userInfo;
                                },
                                pageInfo: function () {
                                    return $scope.pageInfo;
                                }
                            }
                        });

                        modalInstance.result.then(function (message) {
                            if(message == 'thankYou'){
                                $modal.open({
                                    template:
                                    '<div class="modal-body text-center">'+
                                    '<h4><span class="fui-check text-success"></span> 提交成功，感谢您的宝贵意见！</h4>'+
                                        //'<p>关注微信公众账号，第一时间得到更新和改进信息。</p>'+
                                        //'<p><img src="http://mothership.qiniudn.com/53b2348a35de7303c5769c94" width=180></p>'+
                                    '</div>'+
                                    '<div class="modal-footer">'+
                                    '<button class="btn btn-success" data-ng-click="cancel()">返回</button>'+
                                    '</div>',
                                    controller:['$scope','$modalInstance',function($scope,$modalInstance){
                                        $scope.cancel = function () {
                                            $modalInstance.dismiss('cancel');
                                        };
                                    }]
                                });
                            }
                        }, function () {
                        });
                    }
                }],
                template:
                '<section>' +
                '<button id="feedbackbtn" class="btn btn-inverse btn-sm feedback-btn" data-ng-click="showFeedback()">' +
                '意<br/>' +
                '见<br/>' +
                '反<br/>' +
                '馈' +
                '</button>' +
                '</section>'
            };
        }])



})();