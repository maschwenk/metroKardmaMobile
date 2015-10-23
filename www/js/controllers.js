angular.module('starter.controllers', ['ngResource','uiGmapgoogle-maps'])

.controller("DashCtrl", function() {

})

.controller('DashSwiperCtrl', function($scope,$cordovaGeolocation, $state, Stations) {
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
            infoWindow.open(vm.map, marker);
            $state.go('tab.dash.swiper.station', { stationId: station.id});
            console.log(station)
          })

      })

    })

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('DashSwipeeCtrl', function($scope,$cordovaGeolocation, $state, Stations) {
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
            infoWindow.open(vm.map, marker);
            $state.go('tab.dash.swipee.station', { stationId: station.id});
            console.log(station)
          })

      })

    })

  }, function(error){
    console.log("Could not get location");
  });
})

// .controller('MapCtl', function($scope,$cordovaGeolocation, Stations) {
//   var vm = this;

//   var options = {timeout: 10000, enableHighAccuracy: true};

//   $cordovaGeolocation.getCurrentPosition(options).then(function(position){

//     var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

//     var mapOptions = {
//       center: latLng,
//       zoom: 15,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };

//     vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);

//   }, function(error){
//     console.log("Could not get location");
//   });
// })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('StationCtrl', function($scope, station) {
  $scope.station = station;

})

.controller('SwiperPendingCtrl', function($scope) {

})

.controller('SwipeePendingCtrl', function($scope) {

});

