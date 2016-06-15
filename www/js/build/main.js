// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'], function($httpProvider){

  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

})

.run(function($ionicPlatform, $rootScope, $state, $location, $timeout, $ionicHistory, $cordovaToast, UTIL_USER) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
        //判断处于哪个页面时双击退出
        if ($location.path() == '/tab/news') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortTop('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        }
        else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortTop('再按一次退出系统');
            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;
    }, 101);

  });

  var filterStates = [
  "tabs.medicalrecored"
  ,"tabs.my"
  ];
  //监听页面切换-判断页面是否需要登录
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(toState.name == 'login') return;// 如果是进入登录界面则允许
    for(var idx in filterStates){
      var filterState = filterStates[idx];
      if(filterState == toState.name){
        // 如果用户不存在
        if(!UTIL_USER.isLogin()){
          event.preventDefault();// 取消默认跳转行为
          $state.go("login", {from:fromState.name, w:'notLogin'});//跳转到登录界面
        }
      }
      break;
    }
    
  });

})

//自定义ionic配置
app.config(function($ionicConfigProvider) {
  //tabs位置
  $ionicConfigProvider.tabs.position("bottom");
});

//常量
app.constant('APPCONFIG', {
  SERVER_URL_PRE: "http://localhost:8100/api"
});
angular.module('app.controllers', [])
     
.controller('mainIndexCtrl', function($scope, $state) {
	$scope.toSearch = function(){
		$state.go("searchHosAndDoc");
	};
})
   
//就诊记录主页面
.controller('mainMedicalrecordCtrl', function($scope, $stateParams, MedicalRecordService, PatientService) {

	$scope.patientId = $stateParams.patientId;
	$scope.patient = null;

	//刷新页面
	$scope.doRefresh = function(cb){
		if($scope.patient){
			$scope.loadMedicalRecored()
		}else{
			if($scope.patientId){
				//获取就诊人
				PatientService.getPatientById(patientId).then(function(patient){
					$scope.patient = patient;
					$scope.loadMedicalRecored()
				});
			}else{
				//获取当前就诊人
				PatientService.getCurrentPatient().then(function(patient){
					$scope.patient = patient;
					$scope.loadMedicalRecored()
				});
			}
		}
	};

	//加载就诊数据
	$scope.loadMedicalRecored = function(){
		if($scope.patient){
			MedicalRecordService.getOutpatientRecords($scope.patient.idNo).then(function(data){
				$scope.records = data
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};

	//进入页面刷新
	$scope.doRefresh();

})
      
.controller('mainNewsCtrl', function($scope) {

})
   
.controller('mainMyCtrl', function($scope) {

})
 
 //登录
.controller('loginCtrl', function($scope, UserService, $cordovaToast) {	
	$scope.loginParams = {username:null, password: null};
	$scope.login = function(){
		UserService.login($scope.loginParams);
	};
})

 //搜索医院和医生
.controller('searchHosAndDocCtrl', function($scope, $stateParams, HospitalService, DoctorService) {
	
	$scope.search = function(){
		HospitalService.getHospitals({keyWord: $scope.searchStr})
		.then(function(data){
			$scope.hospitals = data.hospitalSimples;
		});
		DoctorService.getDoctors({keyWord: $scope.searchStr})
		.then(function(data){
			$scope.doctors = data.doctors;
		});
	};

})

 //消息列表页
.controller('messagesCtrl', function($scope, MessageService) {
	MessageService.getUnreadMessages().then(function(data){
		$scope.messages = data.data.message;
	});
})

 //医院-详情
.controller('hosDetailCtrl', function($scope, hos) {
	$scope.hos = hos;
})
   
.controller('signupCtrl', function($scope) {

})
 
angular.module('app.directives', [])

.directive('blankDirective', [function(){

}]);


angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  .state('tabs', {
    url: '/tab',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  //主页-首页
  .state('tabs.index', {
    url: '/index',
    views: {
      'tabIndex': {
        templateUrl: 'templates/main_index.html',
        controller: 'mainIndexCtrl'
      }
    }
  })

  //主页-医院主站
  .state('tabs.hospital', {
    url: '/hospital',
    views: {
      'tabHospital': {
        resolve: {
          hos: function(HospitalService){
            return HospitalService.getDefaultHospital();
          }
        },
        templateUrl: 'templates/hospital/detail.html',
        controller: 'hosDetailCtrl'
      }
    }
  })
  //医院-详情页
  .state('tabs.hospitalDetail', {
    url: '/hospital/:id',
    views: {
      'tabHospital': {
        resolve: {
          hos: function(HospitalService, $stateParams){
            return HospitalService.getHospitalById($stateParams.id);
          }
        },
        templateUrl: 'templates/hospital/detail.html',
        controller: "hosDetailCtrl"
      }
    }
  })

  //主页-记录
  .state('tabs.medicalrecored', {
    url: '/medicalrecored',
    cache: false,
    views: {
      'tabMedicalrecored': {
        templateUrl: 'templates/main_medicalrecored.html',
        controller: 'mainMedicalrecordCtrl'
      }
    }
  })

  //主页-资讯
  .state('tabs.news', {
    url: '/news',
    views: {
      'tabNews': {
        templateUrl: 'templates/main_news.html',
        controller: 'mainNewsCtrl'
      }
    }
  })
  //资讯-详情
  .state('news.detail', {
    url: '/news/:newsId',
    views: {
      'tabNews': {
        templateUrl: 'templates/news/news_detail.html',
        controller: 'newsDetailCtrl'
      }
    }
  })


  //主页-我的
  .state('tabs.my', {
    url: '/my',
    views: {
      'tabMy': {
        templateUrl: 'templates/main_my.html',
        controller: 'mainMyCtrl'
      }
    }
  })

  //登录页
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  //注册页
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  //消息列表页
  .state('messages', {
    url: '/messages',
    templateUrl: 'templates/message/messages.html',
    controller: 'messagesCtrl'
  })

  //搜索页
  .state('searchHosAndDoc', {
    url: '/searchHosAndDoc',
    templateUrl: 'templates/search/search_hosanddoc.html',
    controller: 'searchHosAndDocCtrl'
  })


  $urlRouterProvider
    .otherwise('/tab/index')
    ;

});
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