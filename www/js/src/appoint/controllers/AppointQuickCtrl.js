 //快捷预约
app.controller('AppointQuickCtrl', function($scope, $stateParams, $state, AppointService, HospitalService,PatientService) {
	
		//获取默认号源
		AppointService.getDefaultArrayJob().then(function(data){
		$scope.appoint = data.appoint;
		$scope.arrayJob = data.arrayJob;
		
		$scope.hos={hosOrgName:data.arrayJob.hosOrgName,
			        id:data.arrayJob.hosId,
			        hosOrgCode:data.arrayJob.hosOrgCode
		           };//提取医院的关键信息
		$scope.dept = {tHospitalId:data.arrayJob.hosId,
					   deptCode:data.arrayJob.deptCode,
					   deptName:data.arrayJob.deptName
		             };//提取科室信息
		});
       //获取默认的医院
      /* HospitalService.getDefaultHospital().then(function(data){
       	console.log(data);
       	$scope.hos=data;
       })*/
	


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