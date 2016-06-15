 //登录
app.controller('LoginCtrl', function($scope, UserService, $cordovaToast) {	
	$scope.loginParams = {username:null, password: null};
	$scope.login = function(){
		UserService.login($scope.loginParams);
	};
})
