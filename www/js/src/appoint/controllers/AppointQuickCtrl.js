 //快捷预约
app.controller('AppointQuickCtrl', function($scope, $stateParams, $state, AppointService, HospitalService,PatientService) {
	
	//加载医院,及默认预约条件信息
	if($stateParams.hos){
		$scope.hos = $stateParams.hos;
		$scope.appoint={orgName:$scope.hos.hosOrgName,zonename:'sdddddd'};
		$scope.arrayJob={}
	}else{
		//获取默认号源
		AppointService.getDefaultArrayJob().then(function(data){
		$scope.appoint = data.appoint;
		$scope.arrayJob = data.arrayJob;
		});
	}
	


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
						$state.go("appointDetail", {arrayJobId: data});
					});
				}
			});
		}
	};

});