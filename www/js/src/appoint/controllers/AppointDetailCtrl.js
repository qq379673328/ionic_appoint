//预约详情
app.controller('AppointDetailCtrl', function($scope, $stateParams, AppointService){

	//获取默认号源
	AppointService
		.getDetail($stateParams.appointId)
		.then(function(data){
			$scope.appoint = data;
	});

});