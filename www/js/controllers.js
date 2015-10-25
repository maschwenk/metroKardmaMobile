angular.module('starter.controllers', ['ngResource','uiGmapgoogle-maps'])

.controller('DashCtrl', function($scope,$cordovaGeolocation, Stations) {
  var vm = this;
  vm.stations = Stations.queryAll();

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){


    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    vm.map =  new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce(vm.map, 'idle', function() {

      vm.stations.forEach(function(station){
        var location = new google.maps.LatLng(station.latitude, station.longitude);

        var marker = new google.maps.Marker({
          map: vm.map,
          animation: google.maps.Animation.DROP,
          position: location
        });


        var infoWindow = new google.maps.InfoWindow({
          content: station.name +"("+station.lines+")"
        });

        google.maps.event.addListener(marker, 'click', function(){
          infoWindow.open(vm.map, marker)
        })

      })

    })

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('MapCtl', function($scope,$cordovaGeolocation, Stations) {
  var vm = this;

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.myChat = Chats.get({id:1}, function() {
    console.log('test')
  });
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SwiperSwipeeChoiceCtl', function ($state, $log){
    var vm = this;
    vm.goToDash = goToDash;
    function goToDash(swiperOrSwipee){
      $log.info('going to dash as ' + swiperOrSwipee);
      $state.go('tab.dash');
    }
})
// /mobile/www/controllers.js
.controller('LoginCtrl', function($scope, $log,$state, $location, UserSession, $ionicPopup, $rootScope, Auth) {
  var vm = this;
  vm.loginCredentials = {
    email: 'bill@gmail.com',
    password: 'password'
  };
  vm.login = function() {
    Auth.login(vm.loginCredentials, {}).then(function(user) {
      $log.info('user is '+ JSON.stringify(user))
      $state.go('swiper-swipee-choice')
    }, function(err) {
      var error = err["data"]["error"] || err.data.join('. ');
      var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
      });
    });
  }
})


.controller('AccountCtrl', function($scope,$log,Auth) {
  var vm = this;
  vm.currentUser = Auth._currentUser;

  vm.settings = {
    enableFriends: true
  };
});

