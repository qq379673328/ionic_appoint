app.controller('AppointDepartCtrl',function($scope, $stateParams, $state,HospitalService,DepartmentService){
	//是否有更多
	$scope.hasmore = true;
	//是否在加载数据
    var isRun = false;
    //分页起始条数
    var offset = 0;
    //一级科室列表
    $scope.oneList = [];
    //子级列表
    $scope.chidList = [];

	var targetState = $stateParams.targetState;

	
	//获取医院
	var hospital=null;
	if($stateParams.hos){
		$scope.hos = $stateParams.hos;
		hospital=$scope.hos;
	}else{
		//获取默认医院
			HospitalService.getDefaultHospital().then(function(data){
	      		$scope.hos = data;
	      		hospital=$scope.hos;
	    	});
	}
	//加载一级科室
	DepartmentService.getDepartmentList({
		hosId:hospital.id,
		dpLevel:1
	}).then(function(data){
		$scope.oneList = data.departments;
		var oneList = data.departments;
		//加载子科室
		if(oneList.length>0){
			var dep = oneList[0];
				DepartmentService.getDepartmentList({
			hosId:hospital.id,
			parentId:dep.id	
			}).then(function(data){
				$scope.chidList = data.departments;
			});
		}
	});
	//点击一级科室触发的事件
	$scope.showChildList=function(dep){
		DepartmentService.getDepartmentList({
			hosId:hospital.id,
			parentId:dep.id	
			}).then(function(data){
				$scope.chidList = data.departments;
			});
	}
	//点击二级科室触发事件
	
	$scope.go = function(cdep){
		if(cdep){
			    if(cdep.tHosptialId==null){
			       cdep.tHosptialId=hospital.id;
			    }
				if(targetState){
					$state.go(targetState, {dept: cdep}, {reload: true});
				}else{
					$state.go('appointDate',{dept:cdep});
				}
				

			}
	};

	
});