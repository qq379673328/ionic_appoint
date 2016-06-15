angular.module('app.commonservices', [])

/**
公共组件
*/
//公共-弹出消息
.factory('UTIL_DIALOG', function($ionicPopup){
	return {
		show: function(message, title){
			$ionicPopup.alert({
				title: title || "提示信息",
				buttons: [{
					text: '确认',
					type: 'button-balanced'
				}],
				template: message
			});
		}
	};
})
//公共-loading
.factory('UTIL_LOADING', function($ionicLoading){

	return {
		show: function(){
			$ionicLoading.show({
	    		template: '加载中...'
	    	});
		},
		close: function(){
			$ionicLoading.hide();
		}
	};
})

//公共-http
.factory('UTIL_HTTP', function($http, $q, $state, UTIL_LOADING, UTIL_DIALOG, UTIL_USER, APPCONFIG ){

	function sendHttp(params){
		if(!params) return;
		//增加token
		var token = UTIL_USER.getToken();
		if(token){
			if(params.data){
				params.data.token = token;
			}else{
				params.data = {token: token};
			}
		}
		//是否显示loading
		var lastTimeout = null;
		if(params.isShowLoading !== false){

			//延迟显示loading
			var loadingDefferTime = 1000;
			lastTimeout = setTimeout(function(){
				UTIL_LOADING.show();
			}, loadingDefferTime);
		}

		var deferred = $q.defer();
		var promise = deferred.promise;

		var request = {
			url: APPCONFIG.SERVER_URL_PRE + params.url,
			dataType: 'json'
		};
		params.type = params.type || "GET";
		request.method = params.type;
		if(params.type == "GET"){
			request.params = params.data;
		}else{
			request.data = params.data;
		}

		$http(request).success(function(data){
			if(lastTimeout){
				clearTimeout(lastTimeout);
				lastTimeout = null;
			}
			UTIL_LOADING.close();
			if(!data) return;
			if(data.success === "1"){//成功
				deferred.resolve(data.data);
			}else if(data.success === "0"){//失败
				UTIL_DIALOG.show(data.msg || "加载失败");
				deferred.reject("加载失败");
			}else if(data.success === "403"){//未登陆
				$state.go("login");
			}
		}).error(function(er){
			if(lastTimeout){
				clearTimeout(lastTimeout);
				lastTimeout = null;
			}
			UTIL_LOADING.close();
			UTIL_DIALOG.show("加载失败");
			deferred.reject(er);
		});

		return promise;
	}

	return {
		/* get请求
		{
			url: "",//url
			data: {},//参数
			success: {},//成功回调
			isShowLoading: true,//是否显示加载-默认：是
		}
		*/
		get: function(data){
			var reqData = data;
			if(reqData){
				reqData.type = "GET";
			}else{
				reqData = {type: "GET"};
			}
			return sendHttp(reqData);
		},
		/* post请求
		{
			url: "",//url
			data: {},//参数
			success: {},//成功回调
			isShowLoading: true,//是否显示加载-默认：是
		}
		*/
		post: function(data){
			var reqData = data;
			if(reqData){
				reqData.type = "POST";
			}else{
				reqData = {type: "POST"};
			}
			return sendHttp(reqData);
		}
	};

})

//公共-用户状态
.factory('UTIL_USER', function(){

	var USER = {
		ISLOGIN: false,//是否登录
		USER_ID: null,//用户id
		TOKEN: null,//token
		INFO: null//用户信息
	};

	return {
		isLogin: function(){
			return USER.ISLOGIN;//是否登录
		},
		getUserId: function(){
			return USER.USER_ID;//用户id
		},
		getUser: function(){
			return USER.INFO;//用户信息	
		},
		getToken: function(){
			return USER.TOKEN;//token
		},
		IS_Expire: function(){//用户是否过期
			if(!USER.INFO) return true;
			var expireDate = USER.INFO.expire;
			if(!expireDate) return true;
			if(expireDate.getTime() <= new Date().getTime()){
				return true;
			}
			return false;
		},
		setLoginState: function(state){//设置用户登录状态
			USER.ISLOGIN = state;
		},
		setUserInfo: function(info){//设置用户信息
			USER.INFO = info;
		},
		setUserId: function(id){//设置用户id
			USER.USER_ID = id;
		},
		setToken: function(token){//设置用户token
			USER.TOKEN = token;
		},
		logout: function(){//用户登出
			USER = {
				ISLOGIN: false,//是否登录
				USER_ID: null,//用户id
				TOKEN: null,
				INFO: null//用户信息
			};
		}
	};
})


;