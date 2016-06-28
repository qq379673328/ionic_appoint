 //登录
app.controller('LoginCtrl', function($scope, UserService, $cordovaToast) {	
	$scope.loginParams = {username: 'ceshi', password: '11111111'};
	$scope.login = function(){
		UserService.login($scope.loginParams);
	};
})
