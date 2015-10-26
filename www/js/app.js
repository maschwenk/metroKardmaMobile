/* @flow */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'firebase', 'Devise'])

.run(function($ionicPlatform) {
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

})
.config(function($stateProvider, $urlRouterProvider, $httpProvider,AuthProvider) {


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
    url: '/dash/:role',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl as dashCtl',
        resolve: {resolveAuthentication : resolveAuthentication}
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl',
          resolve: {resolveAuthentication : resolveAuthentication}
        }
      }
    })



  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl',
        resolve: {resolveAuthentication : resolveAuthentication}
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
      templateUrl: 'templates/swiper-swipee-choice.html',
      resolve: {resolveAuthentication : resolveAuthentication}
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl as acntCtl',
        resolve: {resolveAuthentication : resolveAuthentication}
      }
    }
  });

  function resolveAuthentication($q, Auth) {
      if (Auth.isAuthenticated()) {
        return $q.when();
      }
      else{
        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('login')
        });
        return $q.reject();
      }

  }


  AuthProvider.loginMethod('POST');
  AuthProvider.loginPath('http://localhost:3000/users/sign_in.json');

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
