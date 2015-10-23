// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'firebase'])

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

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('chooseRole', {
    url: '/choose',
    templateUrl: 'templates/choose.html'
  })
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl as dashCtl'
      }
    }
  })
  .state('tab.dash.swiper', {
    url: '/swiper',
    views: {
      'tab-dash-swiper': {
        templateUrl: 'templates/tab-dash-swiper.html',
        controller: 'DashSwiperCtrl'
      }
    }
  })

  .state('tab.dash.swipee', {
    url: '/swipee',
    views: {
      'tab-dash-swipee': {
        templateUrl: 'templates/tab-dash-swipee.html',
        controller: 'DashSwipeeCtrl'
      }
    }
  })
  .state('tab.dash.swiper.station', {
    url: '/station/:stationId',
    views: {
      'tab-dash-swiper-station': {
        templateUrl: 'templates/tab-dash-swiper-station.html',
        controller: 'StationCtrl'
      }
    },
    resolve: {
      station: function($stateParams, Station){
        return Station.get($stateParams.stationId)
      }
    }
  })

  .state('tab.dash.swiper.pending', {
    url: '/pending',
    views: {
      'tab-dash-swiper-pending' : {
        templateUrl: 'templates/tab-dash-swiper-pending.html',
        controller: 'SwiperPendingCtrl'
      }
    }

  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/choose');

});
