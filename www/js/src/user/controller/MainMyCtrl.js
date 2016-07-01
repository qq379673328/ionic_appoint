//我的-首页
app.controller('MainMyCtrl', function($scope, UserService) {

	UserService.getSummary().then(function(data){
		if(data){
			$scope.myPatientCount = data.myPatientCount;
			$scope.user = data.user;
		}
	});

})