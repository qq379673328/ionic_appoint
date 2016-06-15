angular.module('app.services', [])

.factory('BlankFactory', function(){

})

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


/*业务service*/
//资讯
.service('NewsService', function(UTIL_HTTP){
	return {
		getNews : function(cb){
			return UTIL_HTTP.get({
				url: "/arrayJob/default"
			});
		}
	};
		
})

//医院
.service('HospitalService', function(UTIL_HTTP){
	return {
		getHospitals : function(params){
			return UTIL_HTTP.get({
				url: "/hospital",
				data: params
			});
		},
		getHospitalById : function(hospitalId){
			return UTIL_HTTP.get({
				url: "/hospital/" + hospitalId
			});
		},
		getDefaultHospital: function(){
			return UTIL_HTTP.get({
				url: "/hospital/default"
			});
		}
	};
		
})

//医生
.service('DoctorService', function(UTIL_HTTP){
	return {
		getDoctors : function(params){
			return UTIL_HTTP.get({
				url: "/doctor",
				data: params
			})
		},
		getDoctorById: function(doctorId, cb){
			return UTIL_HTTP.get({
				url: "/doctor/" + doctorId
			});
		}
	};
		
})

//就诊记录
.service('MedicalRecordService', function(UTIL_HTTP){
		
	return {
		//就诊记录列表
		getOutpatientRecords: function(idNo, pageParams){
			return UTIL_HTTP.get({
				url: "/medicalRecords/patient-" + idNo
			});
		},
		//就诊记录列表-有处方数据
		getOutpatientRecordsPrescribe: function(idNo, pageParams){
			return UTIL_HTTP.get({
				url: "/medicalRecords-prescribe/patient-" + idNo
			});
		},
		//就诊记录列表-有医疗费用数据
		getOutpatientRecordsFee: function(idNo, pageParams){
			return UTIL_HTTP.get({
				url: "/medicalRecords-fee/patient-" + idNo
			});
		},
		//就诊记录列表-有检查报告数据
		getOutpatientRecordsCheckReport: function(idNo, pageParams){
			return UTIL_HTTP.get({
				url: "/medicalRecords-checkreport/patient-" + idNo
			});
		},
		//就诊记录列表-有检验报告数据
		getOutpatientRecordsTestReport: function(idNo, pageParams){
			return UTIL_HTTP.get({
				url: "/medicalRecords-testreport/patient-" + idNo
			});
		},
		//获取就诊明细-电子病历、检查单、检验单、处方单
		getOutpatientDetail: function(id){
			return UTIL_HTTP.get({
				url: "/medicalRecordsDetail/patient-" + id
			});
		}
	};

})

//消息
.service('MessageService', function(UTIL_HTTP){
	return {
		getUnreadMessages : function(){
			return UTIL_HTTP.get({
				url: "/usermessage/unread"
			});
		}
	};
		
})

//就诊人
.service('PatientService', function(UTIL_HTTP){
	return {
		//获取当前就诊人
		getCurrentPatient : function(){
			return UTIL_HTTP.get({
				url: "/patient/current"
			});
		},
		//获取我的就诊人列表
		getMyPatients: function(pageParam){
			return UTIL_HTTP.get({
				url: "/patients",
				data: pageParam
			});
		},
		//获取就诊人详细信息
		getPatientById: function(id){
			return UTIL_HTTP.get({
				url: "/patient/" + id
			});
		},
		//添加就诊人
		addPatient: function(patient){
			return UTIL_HTTP.get({
				url: "/patient/add",
				data: patient
			});
		},
		//修改就诊人
		editPatient: function(patient){
			return UTIL_HTTP.get({
				url: "/patient/edit",
				data: patient
			});
		}
	};
		
})

//用户
.service('UserService', function(UTIL_HTTP, UTIL_USER, $state, $stateParams){
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

;