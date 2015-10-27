angular.module('starter.controllers', ['ngResource','uiGmapgoogle-maps'])

.controller('DashCtrl', function($scope,$cordovaGeolocation,$state,$stateParams, Stations) {
  var vm = this;
  //non view-model vars (these will not be accessed by the html)
  var staticOptions = {timeout: 10000, enableHighAccuracy: true};
  var nonStaticMapOptions = {
    center: null,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var markerList = [];

  //done once or when the cache is refreshed
  vm.map =  new google.maps.Map(document.getElementById("map"), nonStaticMapOptions);
  vm.stations = null;
  
  Stations.queryAll(function(result){
    vm.stations = result;
    vm.stations.forEach(function(station){
      var location = new google.maps.LatLng(station.latitude, station.longitude);
      

      var marker = new google.maps.Marker({
        map: null,
        animation: google.maps.Animation.DROP,
        position: location
      });


      var infoWindow = new google.maps.InfoWindow({
        content: station.name +"("+station.lines+")"
      });

      google.maps.event.addListener(marker, 'click', function(){
        infoWindow.open(vm.map, marker);
        $state.go('tab.dash.station', {stationId: station.id, role:$stateParams.role})
      })
      markerList.push(marker);  
    });

    google.maps.event.addListener(vm.map, "idle", function (event) {
      if (vm.map) {
          //This is the current user-viewable region of the map
          var bounds = vm.map.getBounds();
          checkVisibleElements(markerList, bounds);
          //Loop through all the items that are available to be placed on the map
      }
    });
    

  })


  //this snippet borrowed from http://stackoverflow.com/questions/9142833/show-my-location-on-google-maps-api-v3
  var myCurrentLocationMarker = new google.maps.Marker({
    clickable: false,
    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
      new google.maps.Size(22,22),
      new google.maps.Point(0,18),
      new google.maps.Point(11,11)),
    shadow: null,
    zIndex: 999,
    map: vm.map
  });


  $scope.$on('$ionicView.enter', function() {
      // code to run each time view is entered (not cached)
      // need to manage  state http://ionicframework.com/docs/api/directive/ionView/
    getLocationAndProcessIt();
  });
  function getLocationAndProcessIt(){
    $cordovaGeolocation.getCurrentPosition(staticOptions)
      .then(processCurrentLocation)
      .catch(function(error){
          console.log("Could not get location");
      });
  }


  function processCurrentLocation(position){
    nonStaticMapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // Add circle overlay and bind to marker
    myCurrentLocationMarker.setPosition(nonStaticMapOptions.center);
    
    var circle = new google.maps.Circle({
      map: vm.map,
      radius: position.coords.accuracy/10,    // this is in meters, it will take up the screen so we have to reduce for now, on mobile this will work
      fillColor: '#AA0000'
    });
    circle.bindTo('center', myCurrentLocationMarker, 'position');


    vm.map.setCenter(nonStaticMapOptions.center);
  }
  function checkVisibleElements(elementsArray, bounds) {
      //checks if marker is within viewport and displays the marker accordingly - triggered by google.maps.event "idle" on the map Object
      elementsArray.forEach(function (item) {
          //If the item is within the the bounds of the viewport
          if (bounds.contains(item.position)) {
              //If the item isn't already being displayed
              if (item.map != vm.map){
               item.setMap(vm.map);
              }
          } else {
              item.setMap(null);
          }
      });
  }
})

.controller('StationCtrl', function($scope, $stateParams, station){
  $scope.station = station;
  $scope.role = $stateParams.role;
})

.controller('PendingCtrl', function($scope, $stateParams) {
  $scope.role = $stateParams.role;
  $scope.stationName = $stateParams.stationName;
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
      $state.go('tab.dash', {'role': swiperOrSwipee});
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

