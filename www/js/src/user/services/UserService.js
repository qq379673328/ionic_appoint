//用户
app.service('UserService', function(UTIL_HTTP, UTIL_USER, $state, $stateParams){
	return {
		//登录
		login : function(params){
			UTIL_HTTP.post({
				url: "/login",
				data: params
			})
			.then(function(data){
				if(data){
					//计算过期时间
					var expire = data.expire;
					var expireDate = new Date();
					expireDate.setSeconds(expireDate.getSeconds() + expire);
					UTIL_USER.setToken(data.token);
					UTIL_USER.setUserId(data.userId),
					UTIL_USER.setUserInfo({
						id: data.userId,
						token: data.token,
						expire: expireDate
					}),
					UTIL_USER.setLoginState(true);

					//登录成功返回登录之前页面
					var from = $stateParams["from"];
					$state.go(from && from != "login" ? from : "tabs.index");
				}
			});
		},
		//登出
		logout : function(){
			UTIL_HTTP.post({
				url: "/logout"
			}).then(function(data){
				UTIL_USER.logout();
				$state.go("login");
			});
		}
	};

})