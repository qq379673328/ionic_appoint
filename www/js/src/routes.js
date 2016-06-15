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


  $urlRouterProvider
    .otherwise('/tab/index')
    ;

});