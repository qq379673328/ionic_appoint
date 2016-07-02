//预约成功的显示页面
app.controller('AppointSuccessCtrl',function($scope, $stateParams, $state,AppointService){
	//获取预约信息
	AppointService.getDetail($stateParams.appointId).then(function(data){
	 	$scope.appoint = data;
	 });
	//预约详情
	$scope.goDatail=function(appoint){
		$state.go('appointDetail',{appointId:appoint.id});
	}
	//退号
	$scope.cancelAppoint=function(appoint){
		AppointService.back(appoint.id,appoint.state).then(function(data){
			console.log(data);
		})
	}
});