//首页
app.controller('MainIndexCtrl', function($scope, $state, NewsService) {

	//跳转找医院
	$scope.toSearch = function(){
		$state.go("searchHosAndDoc");
	};

	//是否在加载数据
    var isRun = false;

	//加载数据
	function loadData(){
		if(!isRun){
			isRun = true;
			NewsService.getNews(null, {
				limit: 5
			})
			.then(function(data){
				$scope.imgUrlBase = data.imgUrlBase;
				$scope.articles = data.articles;
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	}

	//查询
	$scope.refresh = function(current){
		loadData();
	};

	//默认加载
	loadData();

})