/* @flow */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'firebase', 'Devise'])

.run(function($ionicPlatform, $state, $rootScope, Auth) {
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
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    params: {role:null},
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl as dashCtl'
      }
    }
  })
  .state('tab.dash.station', {
    params: {stationId:null, role:null},
    views: {
      'tab-dash-station': {
        templateUrl: function($stateParams) {
          return 'templates/tab-dash-' + $stateParams.role + '-station.html'
        },
        controller: 'StationCtrl'
      }
    },
    resolve: {
      station: function($stateParams, Station) {
        return Station.get($stateParams.stationId, $stateParams.role)
      }
    }
  })

  .state('tab.dash.pending', {
    params: {role: null, stationName:null, stationId:null},
    views: {
      'tab-dash-station': {
        templateUrl:'templates/tab-dash-pending.html',
        controller: 'PendingCtr'
      }
    },
    resolve: {
      exchange: function($stateParams, kardmaExchanges) {
        return kardmaExchanges.create($stateParams.stationId, $stateParams.role)
      }
    }
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
  AuthProvider.loginPath('http://localhost:3000/users/sign_in.json');

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
