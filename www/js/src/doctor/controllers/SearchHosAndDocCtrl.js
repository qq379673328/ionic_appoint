 //搜索医院和医生
app.controller('SearchHosAndDocCtrl', function($scope, $stateParams, HospitalService, DoctorService) {
	
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