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
		},
		//个人中心概要信息
		getSummary: function(){
			return UTIL_HTTP.get({
				url: "/userinfo/summary"
			});
		},
		//编辑用户信息
		editUser: function(params){
			return UTIL_HTTP.post({
				url: "/userinfo/edit",
				data: params
			});
		},
		//修改密码
		editPassword: function(oldPwd, newPwd, 	dupNewPwd){
			return UTIL_HTTP.post({
				url: "/userinfo/editpwd",
				data: {
					oldPwd: oldPwd,
					newPwd: newPwd,
					dupNewPwd: dupNewPwd
				}
			});
		},
		//编辑头像-base64
		editAvatarByBase64: function(avatar){
			return UTIL_HTTP.post({
				url: "/userinfo/editAvatar",
				data: {
					avatar: avatar
				}
			});
		},
		//反馈意见
		addOpinion: function(info){
			return UTIL_HTTP.post({
				url: "/useropinion/add",
				data: {
					info: info
				}
			});
		},
		//获取所有未读消息
		getUnreadMessage: function(){
			return UTIL_HTTP.get({
				url: "/usermessage/unread"
			});
		}
	};

})