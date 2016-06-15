//首页
app.controller('MainIndexCtrl', function($scope, $state) {
	$scope.toSearch = function(){
		$state.go("searchHosAndDoc");
	};
})