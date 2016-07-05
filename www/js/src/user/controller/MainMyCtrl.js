//我的-首页
app.controller('MainMyCtrl', function($scope, UserService, UTIL_USER, MessageService) {

	//用户是否登录
	$scope.isLogin = UTIL_USER.isLogin();

	if($scope.isLogin){//已登录
		//未读消息数
		MessageService.getUnreadMessageCountFromLocal().then(function(data){
			$scope.unreadMessageCount = data;
		});

		UserService.getSummary().then(function(data){
			if(data){
				$scope.myPatientCount = data.myPatientCount;
				$scope.user = data.user;
			}
		});
	}

});