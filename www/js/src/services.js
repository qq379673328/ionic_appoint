angular.module('app.commonservices', [])

/**
公共组件
*/
//公共-消息
.factory('UTIL_DIALOG', function($ionicPopup, $cordovaToast){
	return {
		//弹出消息
		show: function(message, title){
			$ionicPopup.alert({
				title: title || "提示信息",
				buttons: [{
					text: '确认',
					type: 'button-balanced'
				}],
				template: message
			});
		},
		//显示消息
		alert: function(message){
			$cordovaToast.showShortTop(message)
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
			var loadingDefferTime = 500;
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
				if(params.isShowLoading !== false){
					UTIL_DIALOG.show(data.msg || "加载失败");
				}
				deferred.reject("加载失败");
			}else if(data.success === "403"){//未登陆
				$state.go("login");
			}
		}).error(function(data, header, config, status){
			if(lastTimeout){
				clearTimeout(lastTimeout);
				lastTimeout = null;
			}
			UTIL_LOADING.close();
			if(params.isShowLoading !== false){
				UTIL_DIALOG.show(data.msg || "加载失败");
			}
			deferred.reject("加载失败");
		});

		return promise;
	}

	return {
		/* get请求
		{
			url: "",//url
			data: {},//参数
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

//公共-sqlite存储
.service("$sqliteService", function($q, $cordovaSQLite, APPCONFIG, $log){
	
	var self = this;
	var _db;

	//浏览器中测试数据库初始化脚本
	var sqlInitBrowser = [
		"DROP TABLE IF EXISTS message;",
		//Create
		"CREATE TABLE message (id integer primary key autoincrement, msg text, msgtype text, state text, t_patient_id integer, ext text, msgdetail text, EFFECT_TIME timestamp, createtime timestamp);",
		//Insert
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您已成功预约\"大厂回族自治县人民医院\"就诊！','1','1','1','2016-07-04 11:30:14','{\"timeLimit\":\"晚上\",\"deptName\":\"内科\",\"patientId\":15,\"patientname\":\"江左琳\",\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"主任医师\",\"period\":\"晚上\",\"appointDate\":\"2016-07-04\"}','2016-07-04 11:30:02','您已成功预约\"大厂回族自治县人民医院 内科 主任医师 \"，请江左琳在2016-07-04 晚上到院就诊。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您的预约\"大厂回族自治县人民医院\"即将到期！','2','0','1','2016-07-04 11:30:14','{\"timeLimit\":\"晚上\",\"deptName\":\"内科\",\"patientId\":15,\"patientname\":\"江左琳\",\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"主任医师\",\"period\":\"晚上\",\"appointDate\":\"2016-07-04\"}','2016-07-03 00:00:00','您已成功预约\"大厂回族自治县人民医院 内科 主任医师 \"，请江左琳在2016-07-04 晚上到院就诊。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您的预约\"大厂回族自治县人民医院\"已经到期！','3','1','1','2016-07-04 11:30:14','{\"timeLimit\":\"晚上\",\"deptName\":\"内科\",\"patientId\":15,\"patientname\":\"江左琳\",\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"主任医师\",\"period\":\"晚上\",\"appointDate\":\"2016-07-04\"}','2016-07-04 00:00:00','您已成功预约\"大厂回族自治县人民医院 内科 主任医师 \"，请江左琳在2016-07-04 晚上到院就诊。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('医生为您开具了\"检验项目\"，请缴费！','5','1','1','2016-07-02 17:21:21','{\"idNo\":\"410182198812113311\",\"deptName\":\"内科\",\"patientId\":1,\"hosOrgName\":\"大厂县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"普通医师\",\"deptCode\":\"40198958502\",\"clinNo\":\"1\"}','2016-07-02 17:21:16','您的就诊\"大厂县人民医院 内科 普通医师 \"，有一条（检验项目）需要缴费，请尽快缴费。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您有一个\"检验报告\"已出，请速取！','7','1','1','2016-07-04 14:53:07','{\"idNo\":\"410182198812113311\",\"id\":12,\"deptName\":\"内科\",\"patientId\":1,\"hosOrgName\":\"大厂县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"普通医师\",\"deptCode\":\"40198958502\",\"clinNo\":\"1\"}','2016-07-04 14:52:31','您的（检验项目）报告已出，请到检验室领取报告或自助打印报告。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('医生为您开具了\"检查项目\"，请缴费！','8','1','1','2016-07-02 17:21:21','{\"idNo\":\"410182198812113311\",\"deptName\":\"内科\",\"patientId\":1,\"hosOrgName\":\"大厂县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"普通医师\",\"deptCode\":\"40198958502\",\"clinNo\":\"1\"}','2016-07-02 17:21:16','您的就诊\"大厂县人民医院 内科 普通医师 \"，有一条（检查项目）需要缴费，请尽快缴费。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您有一个\"检查报告\"已出，请速取！','10','1','1','2016-07-04 14:55:13','{\"idNo\":\"410182198812113311\",\"id\":20,\"deptName\":\"内科\",\"patientId\":1,\"hosOrgName\":\"大厂县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":\"普通医师\",\"deptCode\":\"40198958502\",\"clinNo\":\"1\"}','2016-07-04 14:54:37','您的（检查项目）报告已出，请到检验室领取报告或自助打印报告。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('医生为您开具了\"处方\"，请缴费！','11','1','1','2016-07-02 16:27:09','{\"idNo\":\"410182196810145478\",\"deptName\":\"内一科门诊\",\"patientId\":21,\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":null,\"deptCode\":\"0101\",\"clinNo\":\"13654452145_1\"}','2016-07-02 16:27:03','您的就诊\"大厂回族自治县人民医院 内一科门诊  \"，有一条（处方）需要缴费，请尽快缴费。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您有一个\"处方\"已经缴费成功！','12','1','1','2016-07-02 16:27:27','{\"idNo\":\"410182196810145478\",\"deptName\":\"内一科门诊\",\"patientId\":21,\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":null,\"deptCode\":\"0101\",\"clinNo\":\"13654452145_1\"}','2016-07-02 16:27:22','您的就诊\"大厂回族自治县人民医院 内一科门诊  \"，（处方）已经缴费成功，请尽快到“药房”交方。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您已提交处方，请您到领药处领药！','13','1','1','2016-07-02 16:27:27','{\"idNo\":\"410182196810145478\",\"deptName\":\"内一科门诊\",\"patientId\":21,\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":null,\"deptCode\":\"0101\",\"clinNo\":\"13654452145_1\"}','2016-07-02 16:27:22','您的就诊\"大厂回族自治县人民医院 内一科门诊  \"，已经收方，正在配药，请尽快到“药房”拿药。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('感谢您的来诊，来看看我院推荐的服务吧！','17','0','1','2016-07-02 11:30:51','{\"idNo\":\"410182196810145478\",\"deptName\":\"内一科门诊\",\"patientId\":21,\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":null,\"deptCode\":\"0101\",\"clinNo\":\"13654452145_1\"}','2016-07-07 11:30:45','感谢您参与了我院的治疗，根据您的情况，为您推荐如下服务：');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您有一条新的消费记录，请查看！','18','1','1','2016-07-02 16:14:03','{\"idNo\":\"410182196810145478\",\"total\":210.00,\"cardNo\":\"0002306445\",\"cost\":230.00,\"costTime\":\"2016-01-02\"}','2016-07-02 16:13:57','您的就医卡0002306445于2016-01-02消费230.00元，余额210.00元。');",
		"insert into `message` (`MSG`, `MSGTYPE`, `STATE`, `T_PATIENT_ID`, `CREATETIME`, `EXT`, `EFFECT_TIME`, `MSGDETAIL`) values('您的反馈很重要，快来评价吧！','20','0','1','2016-07-02 11:30:51','{\"idNo\":\"410182196810145478\",\"deptName\":\"内一科门诊\",\"patientId\":21,\"hosOrgName\":\"大厂回族自治县人民医院\",\"hosId\":2,\"hosOrgCode\":\"401989585\",\"clinicName\":null,\"deptCode\":\"0101\",\"clinNo\":\"13654452145_1\"}','2016-07-03 11:30:45','为了更好地提高服务质量，请您对本次就诊体验进行评价。');",



	];

	self.db = function () {
		if (!_db) {
			if (window.sqlitePlugin !== undefined) {
				_db = window.sqlitePlugin.openDatabase({ name: APPCONFIG.DB_FILE, location: 2, createFromLocation: 1 });
			} else {
				// For debugging in the browser
				_db = window.openDatabase(APPCONFIG.DB_FILE, "1.0", "Database", 200000);
				self.initBrowserDb();
			}
		}
		return _db;
	};

	//执行sql
	self.executeSql = function (query, parameters) {
		var deferred = $q.defer();

		$cordovaSQLite
			.execute(self.db(), query, parameters)
			.then(function (res) {
				var items = [];
				for (var i = 0; i < res.rows.length; i++) {
					items.push(res.rows.item(i));
				}
				return deferred.resolve(items);
		}, function (err) {
			$log.log(err.message);
			return deferred.reject(err);
		});
		return deferred.promise;
	};

	//初始化浏览器数据库-测试用
	self.initBrowserDb = function () {
		var deferred = $q.defer();
		if (window.sqlitePlugin === undefined) {
			self.db().transaction(function (tx) {
				for (var i = 0; i < sqlInitBrowser.length; i++) {
					var query = sqlInitBrowser[i].replace(/\\n/g, '\n');
					tx.executeSql(query);
				}
			}, function (error) {
				console.dir(error);
				deferred.reject(error);
			}, function () {
				deferred.resolve("OK");
			});
		}
		else {
			deferred.resolve("OK");
		}
		return deferred.promise;
	};

})

;