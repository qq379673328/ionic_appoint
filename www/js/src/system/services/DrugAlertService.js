//用药提醒
app.service('DrugAlertService', function(UTIL_HTTP, UTIL_USER, $sqliteService ){
	return {
		//添加一个时间
		add: function(time){
			var queryParams = [time, UTIL_USER.getUserId()];
			var sql = "insert into drugalert (time, user_id) values (?, ?)";
			return $sqliteService.executeSql(sql, queryParams);
		},
		//取消一个时间
		cancle: function(time){
			var queryParams = [time, UTIL_USER.getUserId()];
			var sql = "delete from drugalert where time = ? and user_id = ?";
			return $sqliteService.executeSql(sql, queryParams);
		},
		//获取所有设置时间
		get: function(){
			var queryParams = [UTIL_USER.getUserId()];
			var sql = "select * from drugalert where user_id = ?";
			return $sqliteService.executeSql(sql, queryParams);
		}
	};

})