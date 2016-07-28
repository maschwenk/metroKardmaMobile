/* @flow */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
                            'starter.controllers', 'starter.services', 'starter.directives', 'starter.filters', 'starter.configuration', //our modules
                            'ngCordova', 'firebase', 'Devise' //third parties
                          ])

.run(function($ionicPlatform, $state, $rootScope, $q, Auth, $log) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
  $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams
      , fromState, fromParams) {

    //this below code will help see what happens during various state transitions - TA
    $log.debug('successfully changes states');
    $log.debug('event', e);
    $log.debug('toState', toState);
    $log.debug('toParams', toParams);
    $log.debug('fromState', fromState);
    $log.debug('fromParams', fromParams);

    var isLogin = toState.name === "login";

    if(isLogin){
      return true; // no need to redirect
    }

    if (Auth.isAuthenticated()) {
      return true;
    }
    else{
      Auth.currentUser()
        .then(function(){
          //either of the two below can happen
          //1. Auth has authenticated a user, and will resolve with that user.
          //2. Auth has not authenticated a user but the server has a previously authenticated session,
          //   Auth will attempt to retrieve that session and resolve with its user.
          //   Then, a devise:new-session event will be broadcast with the current user as the argument.
          return $q.when();
        })
        .catch(function(){
          //http://stackoverflow.com/questions/27212182/angularjs-ui-router-how-to-redirect-to-login-page
          console.log('could not authorize nor find old session for this user. need to prompt for login');
          e.preventDefault(); // stop current execution
          $state.go('login');
        })

    }

  });



})
.config(function($stateProvider, $urlRouterProvider, $httpProvider, AuthProvider) {

  $httpProvider.defaults.withCredentials = true;

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: function ($scope, $rootScope) {
      //consider emitting an event from the chatDetail controller to say that a chat is in progress.  Listen to that event here and set a value to true, then use disabled property of ion-tabs to disable tabs

      // $scope.chatIsHappening = function() {
      //   return true;
      // }
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    cache: false,
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl as mapCtl'
      }
    }
  })
  .state('tab.map.station', {
    params: {stationId:null},
    cache: false,
    controller: 'StationCtrl as stationCtl',
    resolve: {
      station: function($stateParams, stationService, SwiperSwipeeRoleService) {
        return stationService.get($stateParams.stationId)
      }
    }
  })

  .state('tab.map.pending', {
    params: {exchangeId:null},
    cache: false,
    controller: 'PendingCtrl as pendingCtl',
    resolve: {
      exchange: function($stateParams, kardmaExchangeService) {
        return kardmaExchangeService.get($stateParams.exchangeId);
      }
    }
    // resolve: {
    //   station: function($stateParams, stationService, SwiperSwipeeRoleService) {
    //     return stationService.get($stateParams.stationId, SwiperSwipeeRoleService.getCurrentRole())
    //   },
    //   exchange: function(station) {
    //     return station.pending_exchange_for_user[0]
    //   }
    // }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl as chatsCtl'
        }
      }
    })



  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    cache: false,
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl as chatDetailCtl'
      }
    }
  })
  .state( 'login', {
      url: '/login',
      controller: 'LoginCtrl as loginCtl',
      templateUrl: 'templates/login.html'
  })
  .state('swiper-swipee-choice',{
      url: '/swiperSwipeeChoice',
      cache: false,
      controller: 'SwiperSwipeeChoiceCtl as swiperSwipeeChoiceCtl',
      templateUrl: 'templates/swiper-swipee-choice.html'
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl as acntCtl'
      }
    }
  });




  AuthProvider.loginMethod('POST');
  AuthProvider.loginPath('https://guarded-earth-43436.herokuapp.com' + '/users/sign_in.json');
  AuthProvider.logoutPath('https://guarded-earth-43436.herokuapp.com' + '/users/sign_out.json');
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
