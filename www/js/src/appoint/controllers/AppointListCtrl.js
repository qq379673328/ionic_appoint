//我的预约列表
app.controller('AppointListCtrl',function($scope, $stateParams, $state,AppointService,APPCONFIG){
	//是否在加载数据
    var isRun = false;
    //分页起始条数
    var offset = 0;
    $scope.list = [];
    
    loadData();
	//加载数据
	function loadData(){
		if(!isRun){
			isRun = true;
			
			AppointService.getList({
				offset: offset
			}).then(function(data){
				 
				 if(!data || data.length < APPCONFIG.PAGE_SIZE){
				 	$scope.hasmore = false;
				 }
				 offset += APPCONFIG.PAGE_SIZE;
				 $scope.list= $scope.list.concat(data);//追加数据到list中
				 isRun = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	}
	//加载更多
	$scope.loadMore = function(){
		if($scope.hasmore){
			loadData();
		}
	}
	//查看订单详情
	$scope.goDatil=function (appoint){
		$state.go('appointDetail',{appointId:appoint.id});
	}
	//退号
	$scope.cancelAppoint= function(appoint){
		AppointService.back(appoint.id,appoint.state).then(function(data){
			console.log('dsfe4242');
			console.log(data);
		});
	}
});