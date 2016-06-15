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