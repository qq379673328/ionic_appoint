angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  .state('app', {
    url: '/app',
    templateUrl: 'templates/tabsController.html',
    controller: "TabsCtrl",
    abstract:true
  })

  //主页-首页
  .state('app.index', {
    url: '/index',
    views: {
      'tabIndex': {
        templateUrl: 'js/src/index/views/main_index.html',
        controller: 'MainIndexCtrl'
      }
    }
  })

  //主页-医院主站
  .state('app.hospital', {
    url: '/hospital',
    cache: false,
    params: {hos: null, hosId: null},
    views: {
      'tabHospital': {
        templateUrl: 'js/src/hospital/views/detail.html',
        controller: 'HosDetailCtrl'
      }
    }
  })
  //医院切换、医院选择页面
  .state('hosSearch', {
    url: '/hosSearch',
    params: {targetState: "app.hospital"},
    templateUrl: 'js/src/hospital/views/search_hos.html',
    controller: "SearchHosCtrl"
  })
  //药品价格查询
  .state('drugPriceSearch', {
    url: '/drugPriceSearch',
    params: {hos: null},
    templateUrl: 'js/src/hospital/views/search_drugprice.html',
    controller: "DrugPriceSearchCtrl"
  })
  //服务项目价格查询
  .state('servItemPriceSearch', {
    url: '/servItemPriceSearch',
    params: {hos: null},
    templateUrl: 'js/src/hospital/views/search_servitemprice.html',
    controller: "ServItemPriceSearchCtrl"
  })

  //找大夫、医生选择页面
  .state('doctorSearch', {
    url: '/doctorSearch',
    params: {targetState: "doctorDetail"},
    templateUrl: 'js/src/doctor/views/doctor_search.html',
    controller: "SearchDoctorCtrl"
  })
  //医生主页面
  .state('doctorDetail', {
    url: '/doctorDetail',
    params: {doctor: null, doctorId: null},
    templateUrl: 'js/src/doctor/views/doctor_detail.html',
    controller: "DoctorDetailCtrl"
  })

  //预约挂号-快速
  .state('appointQuick', {
    url: '/appointQuick',
    params: {zone: null,hos:null},
    templateUrl: 'js/src/appoint/views/appoint_quick.html',
    controller: "AppointQuickCtrl"
  })
  //预约详情页
  .state('appointDetail', {
    url: '/appointDetail',
    params: {arrayJobId: null},
    templateUrl: 'js/src/appoint/views/appoint_detail.html',
    controller: "AppointDetailCtrl"
  })

  //主页-记录
  .state('app.medicalrecored', {
    url: '/medicalrecored',
    params: {patient: null, patientId: null},
    cache: false,
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/main_medicalrecored.html',
        controller: 'MainMedicalrecordCtrl'
      }
    }
  })
  //就诊明细
  .state('app.medicalrecoredDetail', {
    url: '/medicalrecoredDetail/:id',
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/medicalrecord_detail.html',
        controller: 'MedicalrecordDetailCtrl'
      }
    }
  })
  //门诊-处方明细
  .state('app.medicalrecoredPre', {
    url: '/medicalrecoredPre/:idNo',
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/medicalrecord_pre.html',
        controller: 'MedicalrecordPreCtrl'
      }
    }
  })
  //门诊-医疗费用
  .state('app.medicalrecoredFee', {
    url: '/medicalrecoredFee/:idNo',
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/medicalrecord_fee.html',
        controller: 'MedicalrecordFeeCtrl'
      }
    }
  })
  //门诊-报告查询
  .state('app.medicalrecoredReport', {
    url: '/medicalrecoredReport/:idNo',
    views: {
      'tabMedicalrecored': {
        templateUrl: 'js/src/medicalrecoreds/views/medicalrecord_report.html',
        controller: 'MedicalrecordReportCtrl'
      }
    }
  })


  //主页-资讯
  .state('app.news', {
    url: '/news',
    views: {
      'tabNews': {
        templateUrl: 'js/src/news/views/main_news.html',
        controller: 'MainNewsCtrl'
      }
    }
  })
  //资讯-详情
  .state('app.newsDetail', {
    url: '/detail/:newsId',
    params: {newsId: null},
    views: {
      'tabNews': {
        templateUrl: 'js/src/news/views/news_detail.html',
        controller: 'NewsDetailCtrl'
      }
    }
  })


  //主页-我的
  .state('app.my', {
    url: '/my',
    cache: false,
    views: {
      'tabMy': {
        templateUrl: 'js/src/user/views/main_my.html',
        controller: 'MainMyCtrl'
      }
    }
  })
  //就诊人-列表
  .state('app.patientList', {
    url: '/patient-list',
    params: {targetState: "app.patientEdit"},
    cache: false,
    views: {
      'tabMy': {
        templateUrl: 'js/src/user/views/patient_list.html',
        controller: 'PatientListCtrl'
      }
    }
  })
  //就诊人-编辑
  .state('app.patientEdit', {
    url: '/patient-edit',
    params: {patient: null},
    views: {
      'tabMy': {
        templateUrl: 'js/src/user/views/patient_edit.html',
        controller: 'PatientEditCtrl'
      }
    }
  })
  //关于我们
  .state('app.aboutUs', {
    url: '/aboutUs',
    views: {
      'tabMy': {
        templateUrl: 'js/src/system/views/about_us.html'
      }
    }
  })
  //功能介绍
  .state('app.introduction', {
    url: '/introduction',
    views: {
      'tabMy': {
        templateUrl: 'js/src/system/views/introduction.html'
      }
    }
  })
  //意见反馈
  .state('app.opinion', {
    url: '/opinion',
    views: {
      'tabMy': {
        templateUrl: 'js/src/user/views/opinion.html',
        controller: 'OpinionCtrl'
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
  .state('app.messagelist', {
    url: '/messages',
    cache: false,
    views: {
      'tabMy': {
        templateUrl: 'js/src/message/views/messages.html',
        controller: 'MessagesListCtrl'
      }
    }
  })
  //消息详情页
  .state('app.messagedetail', {
    url: '/messagedetail',
    params: {message: null},
    views: {
      'tabMy': {
        templateUrl: 'js/src/message/views/message_detail.html',
        controller: 'MessagesDetailCtrl'
      }
    }
  })

  //搜索页
  .state('searchHosAndDoc', {
    url: '/searchHosAndDoc',
    templateUrl: 'js/src/hospital/views/search_hosanddoc.html',
    controller: 'SearchHosAndDocCtrl'
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

	//预约挂号确认页
	.state('appointMent',{
		params:{aj:null},
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
		params:{hos:null,targetState:null},
		url:'/appointDepart',
		templateUrl:'js/src/appoint/views/appoint_depart.html',
		controller:'AppointDepartCtrl'
	})
	
	//预约选日期及时间段
	.state('appointDate',{
		params:{dept:null},
		url:'/appointDate',
		templateUrl:'js/src/appoint/views/appoint_date.html',
		controller:'AppointDateCtrl'
	})
	
	//预约详情页
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
	})

  .state("other", {
    url: "/other",
    abstract: true,
    controller: "OtherCtrl",
    template: "<ion-nav-view></ion-nav-view>",
    onEnter: function($rootScope, fromStateServ) {
        fromStateServ.setState("other", $rootScope.fromState, $rootScope.fromParams);
    }
  })

  ;

  $urlRouterProvider
    .otherwise('/app/index')
    ;

});