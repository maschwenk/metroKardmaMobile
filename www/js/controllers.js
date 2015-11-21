(function(){
'use strict';
angular.module('starter.controllers', ['ngResource','uiGmapgoogle-maps'])

  .controller('DashCtrl', function($scope,$cordovaGeolocation,$state,$stateParams,
                                  Stations, SwiperSwipeeRole) {
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
    vm.stations = null;
    vm.map = null;
    vm.accuracyRadiusMarker = new google.maps.Circle({
      map: null,
      radius: null,   // this is in meters, it will take up the screen so we have to reduce for now, on mobile this will work
      fillColor: '#AA0000'
    });




    //this snippet borrowed from http://stackoverflow.com/questions/9142833/show-my-location-on-google-maps-api-v3
    var myCurrentLocationMarker = new google.maps.Marker({
      clickable: false,
      icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new google.maps.Size(22,22),
        new google.maps.Point(0,18),
        new google.maps.Point(11,11)),
      shadow: null,
      zIndex: 999,
    });


    $scope.$on('$ionicView.enter', function() {
      // code to run each time view is entered (not cached)
      // need to manage  state http://ionicframework.com/docs/api/directive/ionView/
      if(vm.map === null){
          vm.map =  new google.maps.Map(document.getElementById("map"), nonStaticMapOptions);
          vm.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
  document.getElementById('legend'));
      }
      getLocationAndProcessIt();
      placeStationMarkers();
    });
    function getLocationAndProcessIt(){
      $cordovaGeolocation.getCurrentPosition(staticOptions)
        .then(processCurrentLocation)
        .catch(function(error){
          console.log("Could not get location");
        });
    }
    function placeStationMarkers(){

      Stations(SwiperSwipeeRole.getCurrentRole()).queryAll(function(result){
        vm.stations = result;
        markerList = [];
        vm.stations.forEach(function(station){
          var location = new google.maps.LatLng(station.latitude, station.longitude);
          if ((SwiperSwipeeRole.isSwiper() && station.exchanges_needing_swiper.length > 0) || (SwiperSwipeeRole.isSwipee() && station.exchanges_needing_swipee.length > 0)) {
            var pinColor = "FFFF00"
        } else {
            var pinColor = "FE7569"
        }

          var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

          var marker = new google.maps.Marker({
            map: vm.map,
            animation: google.maps.Animation.DROP,
            position: location,
            icon: pinImage
          });


          var infoWindow = new google.maps.InfoWindow({
            content: station.name +"("+station.lines+")"
          });

          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.open(vm.map, marker);
            $state.go('tab.dash.station', {stationId: station.id, role: SwiperSwipeeRole.getCurrentRole()});
          })
          markerList.push(marker);
        });
      })
      google.maps.event.addListener(vm.map, "idle", function (event) {
        if (vm.map) {
          //This is the current user-viewable region of the map
          var bounds = vm.map.getBounds();
          if(bounds){
            checkVisibleElements(markerList, bounds);
          }
          //Loop through all the items that are available to be placed on the map
        }
      });
    }

    function processCurrentLocation(position){
      nonStaticMapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // Add circle overlay and bind to marker
      myCurrentLocationMarker.setMap(vm.map);
      myCurrentLocationMarker.setPosition(nonStaticMapOptions.center);

      var accuracyRadius = position.coords.accuracy/10;
      vm.accuracyRadiusMarker.setMap(vm.map);
      vm.accuracyRadiusMarker.setRadius(accuracyRadius);
      vm.accuracyRadiusMarker.bindTo('center', myCurrentLocationMarker, 'position');

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

  .controller('StationCtrl', function($scope, $stateParams, station, kardmaExchanges, SwiperSwipeeRole, $state, $ionicPopup, Chat, Auth){
    $scope.station = station;
    var vm = this;
    vm.currentUser = Auth._currentUser.id

    $scope.$on('$ionicView.enter', function(e) {
      $scope.role = SwiperSwipeeRole.getCurrentRole();
    });

    function otherExchangePopup(role, station) {
     var popUp = $ionicPopup.confirm({
      template: "You currently have a request as a " +role + " at " + station + ".  Click 'OK' to override your other request with this one."
    })
     return popUp
   }

    function findOrInitiateChat(otherUserId){
      var swiperSwipeeObj = SwiperSwipeeRole.isSwiper() ?
        { swiper_id : vm.currentUser ,  swipee_id: otherUserId } :
        { swiper_id : otherUserId ,  swipee_id: vm.currentUser }
      var newChat = new Chat(swiperSwipeeObj);
      newChat.$save().then(function(chat){
        $state.go('tab.chat-detail', {'chatId': chat.chat_id});
      })

    }

    $scope.checkForExchangesAndCreate = function() {
      kardmaExchanges.create($stateParams.stationId, $scope.role).then(function(res) {
          if (res.data.errors) {
            //this branch occurs if the current user has another pending exchange open
            var roleInOtherExchange = res.data.errors[0]
            var stationOtherExchange = res.data.errors[1]
            var idOtherExchange = res.data.errors[2]


            otherExchangePopup(roleInOtherExchange, stationOtherExchange).then(function(resp) {
              if(resp) {
                kardmaExchanges.cancelThenCreate(idOtherExchange, $stateParams.stationId, $scope.role).then(function() {
                    $state.go('tab.dash.pending', {stationId: station.id, role:$scope.role})
                })
              } else {
                console.log("You are not sure")
              }
            })
        } else {
          $state.go('tab.dash.pending', {stationId: station.id, role:$scope.role})

        }
      })
    };

    $scope.updateExchangeAndStartChat = function(exchangeId, userId) {
      kardmaExchanges.updateMatch(exchangeId, $scope.role).then(function(res) {
        if (res.data.errors) {
          var roleInOtherExchange = res.data.errors[0]
          var stationOtherExchange = res.data.errors[1]
          var idOtherExchange = res.data.errors[2]

          otherExchangePopup(roleInOtherExchange, stationOtherExchange).then(function(resp) {
            if (resp) {
              kardmaExchanges.cancelThenUpdateMatch(idOtherExchange, exchangeId, $scope.role).then(function() {
                findOrInitiateChat(userId)
              })
            } else {
              console.log("You clicked Cancel")
            }
          })
        } else {
          findOrInitiateChat(userId)
        }

      })
    }


  })

  .controller('PendingCtrl', function($scope, $stateParams, $state, kardmaExchanges, station, exchange, SwiperSwipeeRole) {
    $scope.station = station;
    $scope.$on('$ionicView.enter', function(e) {
      $scope.role = SwiperSwipeeRole.getCurrentRole();
    });

    $scope.cancelExchange = function() {
      kardmaExchanges.cancel(exchange.id).then(function() {
        $state.go('tab.dash.station', {
          stationId: station.id, role: $scope.role
        })
      })
    }
  })

  .controller('ChatsCtrl', function($scope, $state,
                                    UserCatalog, Chat, Auth, SwiperSwipeeRole  ) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    var vm = this;
    vm.allUsers = null;
    vm.findOrInitiateChat = findOrInitiateChat;

    $scope.$on('$ionicView.enter', function(e) {
      UserCatalog.query().$promise.then(function(users){
        vm.allUsers = users;
      });
      vm.currentUser = Auth._currentUser.id;
      vm.SwiperSwipeeRole = SwiperSwipeeRole;

    });

    function findOrInitiateChat(otherUserId){
      var swiperSwipeeObj = SwiperSwipeeRole.isSwiper() ?
        { swiper_id : vm.currentUser ,  swipee_id: otherUserId } :
        { swiper_id : otherUserId ,  swipee_id: vm.currentUser }
      var newChat = new Chat(swiperSwipeeObj);
      newChat.$save().then(function(chat){
        $state.go('tab.chat-detail', {'chatId': chat.chat_id});
      })

    }


  })

  .controller('ChatDetailCtrl', function($scope, $stateParams,$resource, $timeout, $interval,$ionicScrollDelegate,
                                         Chat, Auth, User, SwiperSwipeeRole, kardmaExchanges ) {
    var vm = this;
    var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    vm.chat = null;
    vm.otherUser = null;
    vm.messageToSend = null;
    vm.messages = [];
    vm.inputUp = inputUp;
    vm.inputDown = inputDown;
    vm.sendMessage = sendMessage;
    vm.sendKarmda = sendKardma;

    $scope.$on('$ionicView.enter', function(e) {
      vm.currentUser = Auth._currentUser;
      vm.SwiperSwipeeRole = SwiperSwipeeRole;

      $ionicScrollDelegate.$getByHandle('messageScroll').scrollBottom(true);
      Chat.get({chatId: $stateParams.chatId}).$promise.then(function (chat) {
        vm.chat = chat;
        var otherUserQuery = vm.currentUser.id === chat.swiper_id ?
          User.get({userId: chat.swipee_id}) : User.get({userId: chat.swiper_id});
        otherUserQuery.$promise.then(function (otherUser) {
          vm.otherUser = otherUser;
          startRefresh();
        });
      });

    });

    $scope.$on('$ionicView.leave', function(e) {
      $interval.cancel(vm.messagesIntervalObj);
    });

    $scope.$on("$destroy",function( event ) {
      $interval.cancel(vm.messagesIntervalObj);
    });

    function inputUp() {
      if (isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);
    }

    function inputDown() {
      if (isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    }

    function startRefresh(){
      vm.messagesIntervalObj = $interval(getAllMessages, 1000);
    }

    function getAllMessages(){
      var Messages = $resource('http://localhost:3000/chats/:chatId/messages/',
        {chatId: vm.chat.id});
      //very simplistic change detection, other ways of doing this
      var prevLength = vm.messages.length;
      Messages.query().$promise.then(function(messages){
        vm.messages = messages;
        if(prevLength < vm.messages.length){
          $ionicScrollDelegate.$getByHandle('messageScroll').scrollBottom(true);
        }
      });
      $timeout(function() {
        $ionicScrollDelegate.$getByHandle('messageScroll').resize();
      });
    }

    function sendKardma(){
      kardmaExchanges
        .findAndCompleteExchange()
        .then(function(data){
          console.log('it\'s completed dog.');
        })
        .catch(function(err){
          console.error('Error :'+ err.data.errors);
        });
    }

    function sendMessage(){
      if ( !vm.messageToSend ){
        return;
      }
      var Message = $resource('http://localhost:3000/chats/:chatId/messages/:messageId',
        {chatId: vm.chat.id, messageId:'@id'});
      var newMessage = new Message({
        body: vm.messageToSend,
        chat_id: vm.chat.id,
        user_id: vm.currentUser.id
      });
      newMessage.$save().then(function(message){
        delete vm.messageToSend;
        console.log('message created. Id is ' + message);

      });

    }
  })

  .controller('SwiperSwipeeChoiceCtl', function ($state, $log, SwiperSwipeeRole){
    var vm = this;
    vm.goToDash = goToDash;
    function goToDash(swiperOrSwipee){
      $log.info('going to dash as ' + swiperOrSwipee);
      SwiperSwipeeRole.setCurrentRole(swiperOrSwipee);
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
        var error = "";
        if(err){
          error = err["data"]["error"] || err.data.join('. ');
        }
        var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
        });
      });
    }
  })


  .controller('AccountCtrl', function($scope,$log,Auth,$state, simpleAlertPopup, SwiperSwipeeRole) {
    var vm = this;
    vm.currentUser = Auth._currentUser;
    vm.settings = {
      enableFriends: true
    };
    vm.logout = logout;



    $scope.$on('$ionicView.enter', function(e) {
      vm.currentUser = Auth._currentUser;
      // approach to binding to services hotly debated...one of the things i hate abount angular is
      // that there are too many ways to do things
      // http://stackoverflow.com/questions/15800454/angularjs-the-correct-way-of-binding-to-a-service-properties

      vm.SwiperSwipeeRole = SwiperSwipeeRole;

    });

    function logout(){
      Auth.logout().then(function(oldUser) {
        simpleAlertPopup.show('Logged out',oldUser.first_name + ' , you have been logged out sucessfully.')
        $state.go('login');
      }, function(error) {

      });
    }
  });

})();
