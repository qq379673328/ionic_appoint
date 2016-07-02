//就诊人列表
app.controller('PatientListCtrl', function($scope, $state, $stateParams, APPCONFIG, PatientService) {
	
	//是否有更多
	$scope.hasmore = true;
    //分页起始条数
    var offset = 0;

	$scope.searchParams = {};
	$scope.items = [];

	var targetState = $stateParams.targetState;
	//选择就诊人跳转页面
	if(targetState){
		$scope.go = function(patient){
			$state.go(targetState, {patient: patient,otherParams:$stateParams.otherParams}, {reload: true});
		};
	}

	//加载数据
	function loadData(isReload, extParams){

		PatientService.getMyPatients({
			offset: offset
		})
		.then(function(data){
			if(!data || data.length < APPCONFIG.PAGE_SIZE){
				$scope.hasmore = false;
			}
			if(isReload){//刷新
				$scope.items = data;
			}else{//加载更多
				$scope.items = $scope.items.concat(data);
				offset += APPCONFIG.PAGE_SIZE;
			}
			isRun = false;
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}

	//加载更多
	$scope.loadMore = function(){	
		if($scope.hasmore){
			loadData(false);
		}
	};
	
});
