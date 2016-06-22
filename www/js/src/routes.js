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
        templateUrl: 'js/src/index/views/main_index.html',
        controller: 'MainIndexCtrl'
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
        templateUrl: 'js/src/hospital/views/detail.html',
        controller: 'HosDetailCtrl'
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
        templateUrl: 'js/src/hospital/views/detail.html',
        controller: "HosDetailCtrl"
      }
    }
  })

  //主页-记录
  .state('tabs.medicalrecored', {
    url: '/medicalrecored',
    cache: false,
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/main_medicalrecored.html',
        controller: 'MainMedicalrecordCtrl'
      }
    }
  })

  //主页-资讯
  .state('tabs.news', {
    url: '/news',
    views: {
      'tabNews': {
        templateUrl: 'js/src/news/views/main_news.html',
        controller: 'MainNewsCtrl'
      }
    }
  })
  //资讯-详情
  .state('news.detail', {
    url: '/news/:newsId',
    views: {
      'tabNews': {
        templateUrl: 'js/src/news/views/news_detail.html',
        controller: 'NewsDetailCtrl'
      }
    }
  })


  //主页-我的
  .state('tabs.my', {
    url: '/my',
    views: {
      'tabMy': {
        templateUrl: 'js/src/user/views/main_my.html',
        controller: 'MainMyCtrl'
      }
    }
  })

  //登录页
  .state('login', {
    url: '/login',
    templateUrl: 'js/src/user/views/login.html',
    controller: 'LoginCtrl'
  })

  //注册页
  .state('signup', {
    url: '/signup',
    templateUrl: 'js/src/user/views/signup.html',
    controller: 'SignupCtrl'
  })

  //消息列表页
  .state('messages', {
    url: '/messages',
    templateUrl: 'js/src/message/views/messages.html',
    controller: 'MessagesCtrl'
  })

  //搜索页
  .state('searchHosAndDoc', {
    url: '/searchHosAndDoc',
    templateUrl: 'js/src/hospital/views/search_hosanddoc.html',
    controller: 'SearchHosAndDocCtrl'
  })	
	
		//找医院页
	.state('searchHos',{
		url:'/searchHos',
		templateUrl:'js/src/hospital/views/search_hos.html',
		controller:'SearchHosCtrl'
	})
	
	
		//找医生页
	.state('searchDoctor',{
		url:'/searchDoctor',
		templateUrl:'js/src/doctor/views/search_doc.html',
		controller:'SearchDoctorCtrl'
	})
	
	//查药价页
	.state('searchDurgPrice',{
		url:'/searchDurgPrice',
		templateUrl:'js/src/durg/views/search_durg_price.html',
		controller:'SearchDurgPriceCtrl'
	})
	
	//查服务价页
	.state('searchServicePrice',{
		url:'/searchServicePrice',
		templateUrl:'js/src/durg/views/search_service_price.html',
		controller:'SearchServicePriceCtrl'
	})

	//预约挂号页
	.state('appointMent',{
		url:'/appointMent',
		templateUrl:'js/src/appoint/views/appoint_ment.html',
		controller:'AppointMentCtrl'
	})
	
	//预约选医院页
	.state('appointHos',{
		url:'/appointHos',
		templateUrl:'js/src/appoint/views/appoint_hos.html',
		controller:'AppointHosCtrl'
	})
	
	//预约选科室
	.state('appointDepart',{
		url:'/appointDepart',
		templateUrl:'js/src/appoint/views/appoint_depart.html',
		controller:'AppointDepartCtrl'
	})
	
	//预约选日期及时间段
	.state('appointDate',{
		url:'/appointDate',
		templateUrl:'js/src/appoint/views/appoint_date.html',
		controller:'AppointDateCtrl'
	})
	
	//预约确认信息(详情)页
	.state('appointMentDatail',{
		url:'/appointMentDatail',
		templateUrl:'js/src/appoint/views/appointment_datail.html',
		controller:'AppointMentDatailCtrl'
	})
	
	//预约成功页
	.state('appointSuccess',{
		url:'/appointSuccess',
		templateUrl:'js/src/appoint/views/appoint_success.html',
		controller:'AppointSuccessCtrl'
	})
	
	//预约成功详情页
	.state('appointSuccessDatail',{
		url:'/appointSuccessDatail',
		templateUrl:'js/src/appoint/views/appoint_success_datail.html',
		controller:'AppointSuccessDatailCtrl'
	});
  $urlRouterProvider
    .otherwise('/tab/index')
    ;

});