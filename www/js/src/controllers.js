angular.module('app.controllers', [])
     
.controller('mainIndexCtrl', function($scope, $state) {
	$scope.toSearch = function(){
		$state.go("searchHosAndDoc");
	};
})
   
//就诊记录主页面
.controller('mainMedicalrecordCtrl', function($scope, $stateParams, MedicalRecordService, PatientService) {

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
      
.controller('mainNewsCtrl', function($scope) {

})
   
.controller('mainMyCtrl', function($scope) {

})
 
 //登录
.controller('loginCtrl', function($scope, UserService, $cordovaToast) {	
	$scope.loginParams = {username:null, password: null};
	$scope.login = function(){
		UserService.login($scope.loginParams);
	};
})

 //搜索医院和医生
.controller('searchHosAndDocCtrl', function($scope, $stateParams, HospitalService, DoctorService) {
	
	$scope.search = function(){
		HospitalService.getHospitals({keyWord: $scope.searchStr})
		.then(function(data){
			$scope.hospitals = data.hospitalSimples;
		});
		DoctorService.getDoctors({keyWord: $scope.searchStr})
		.then(function(data){
			$scope.doctors = data.doctors;
		});
	};

})

 //消息列表页
.controller('messagesCtrl', function($scope, MessageService) {
	MessageService.getUnreadMessages().then(function(data){
		$scope.messages = data.data.message;
	});
})

 //医院-详情
.controller('hosDetailCtrl', function($scope, hos) {
	$scope.hos = hos;
})
   
.controller('signupCtrl', function($scope) {

})
 