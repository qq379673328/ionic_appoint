 //快捷预约
app.controller('AppointQuickCtrl', function($scope, $stateParams, $state, AppointService, HospitalService,PatientService) {
	
		//获取默认号源
		AppointService.getDefaultArrayJob().then(function(data){
		$scope.appoint = data.appoint;
		$scope.arrayJob = data.arrayJob;
		});

	


	//预约
	$scope.appointMent = function(){
		if($scope.arrayJob){
			PatientService.getCurrentPatient().then(function(patient){
				if(patient){
					AppointService.add(
						patient.id,
						$scope.arrayJob.id
						)
					.then(function(data){
						$state.go("appointSuccess", {appointId: data});
					});
				}
			});
		}
	};

});