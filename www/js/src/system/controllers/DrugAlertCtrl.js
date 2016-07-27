//服药提醒
app.controller('DrugAlertCtrl', function($scope, $state, $stateParams) {

	//初始化时间段
	$scope.alerts = [[], [], [], []];
	for(var i = 0; i < 24; i++){
		var timeBase = i < 10 ? "0" + i : "" + i,
			hour = timeBase + ":00",
			hourHalf = timeBase + ":30";
		var zone = 0;
		if(i > 0 && i < 6){
			zone = 0;
		}else if(i >= 6 && i < 12){
			zone = 1;
		}else if(i >= 12 && i < 18){
			zone = 2;
		}else if(i >= 18 && i < 24){
			zone = 3;
		}
		$scope.alerts[zone].push(hour);
		$scope.alerts[zone].push(hourHalf);
	}

	$scope.current = 0;


})
