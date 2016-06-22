 //医院-详情
app.controller('HosDetailCtrl', function($scope, $stateParams, HospitalService) {

	if($stateParams.hos){//传入医院对象
		$scope.hos = $stateParams.hos;
	}else if($stateParams.hosId){//传入医院id
		HospitalService.getHospitalById($stateParams.hosId).then(function(data){
			$scope.hos = data;
		});
	}else{//默认
		HospitalService.getDefaultHospital().then(function(data){
			$scope.hos = data;
		});
	}

});