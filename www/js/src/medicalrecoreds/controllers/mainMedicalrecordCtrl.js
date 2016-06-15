//就诊记录主页面
app.controller('MainMedicalrecordCtrl', function($scope, $stateParams, MedicalRecordService, PatientService) {

	$scope.patientId = $stateParams.patientId;
	$scope.patient = null;

	//刷新页面
	$scope.doRefresh = function(cb){
		if($scope.patient){
			$scope.loadMedicalRecored()
		}else{
			if($scope.patientId){
				//获取就诊人
				PatientService.getPatientById(patientId).then(function(patient){
					$scope.patient = patient;
					$scope.loadMedicalRecored()
				});
			}else{
				//获取当前就诊人
				PatientService.getCurrentPatient().then(function(patient){
					$scope.patient = patient;
					$scope.loadMedicalRecored()
				});
			}
		}
	};

	//加载就诊数据
	$scope.loadMedicalRecored = function(){
		if($scope.patient){
			MedicalRecordService.getOutpatientRecords($scope.patient.idNo).then(function(data){
				$scope.records = data
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};

	//进入页面刷新
	$scope.doRefresh();

})