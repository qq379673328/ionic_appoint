//意见反馈
app.controller('OpinionCtrl', function($scope, UserService, UTIL_MESSAGE, $state) {
	$scope.params = {};
	$scope.save = function(){
		UserService.addOpinion($scope.params.info).then(function(){
			UTIL_MESSAGE.show("反馈成功");
			$state.go("tabs.my");
		});
	};
})
