//资讯详情页
app.controller('NewsDetailCtrl', function($scope, $stateParams, APPCONFIG) {

	var articleId = $stateParams.newsId;
	if(articleId){
		$scope.articleSrc = APPCONFIG.SERVER_URL_PRE + "/consult/mobile/article_" + articleId + ".html";
	}
});