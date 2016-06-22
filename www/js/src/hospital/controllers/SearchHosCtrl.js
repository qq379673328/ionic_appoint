//查询医院
app.controller('SearchHosCtrl',function($scope,HospitalService){
	HospitalService.getHospitals({hosName: $scope.searchStr,
		hosType:$scope.hosType,hosLevel:$scope.hosLevel})
		.then(function(data){
			$scope.hospitals = data.hospitalSimples;
		});
});
