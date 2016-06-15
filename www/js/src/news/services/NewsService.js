//资讯
app.service('NewsService', function(UTIL_HTTP){
	return {
		getNews : function(cb){
			return UTIL_HTTP.get({
				url: "/arrayJob/default"
			});
		}
	};
		
})