angular.module('starter.controllers', ['ngResource','uiGmapgoogle-maps'])
.controller('DashCtrl', function($scope,$cordovaGeolocation,$state,$stateParams, Stations) {
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

//       vm.stations.slice(10).forEach(function(station){
//         var location = new google.maps.LatLng(station.latitude, station.longitude);

//         var marker = new google.maps.Marker({
//           map: vm.map,
//           animation: google.maps.Animation.DROP,
//           position: location
//         });


//         var infoWindow = new google.maps.InfoWindow({
//           content: station.name +"("+station.lines+")"
//         });

//         google.maps.event.addListener(marker, 'click', function(){
//           infoWindow.open(vm.map, marker);
//           $state.go('tab.dash.station', {stationId: station.id, role:$stateParams.role})
//         })

//       })

    })

  }, function(error){
    console.log("Could not get location");
  });
})

.controller('StationCtrl', function($scope, $stateParams, $state, $ionicPopup, station, kardmaExchanges){
  $scope.station = station;
  $scope.role = $stateParams.role;



  $scope.createExchange = function() {
      kardmaExchanges.create($stateParams.stationId, $stateParams.role).then(function(res) {
          if (res.data.errors) {
            $ionicPopup.alert({
              template: '<p>You must cancel your other pending exchanges before doing this<p>'
            })
        } else {
          $state.go('tab.dash.pending', {stationId: station.id, role:$stateParams.role})

        }
      })
    }


})

.controller('PendingCtrl', function($scope, $stateParams, $state, kardmaExchanges, station, exchange) {
  $scope.role = $stateParams.role;
  $scope.station = station;

  $scope.cancelExchange = function() {
    kardmaExchanges.cancel(exchange.id).then(function() {
      $state.go('tab.dash.station', {
        stationId: station.id, role: $stateParams.role
      })
    })
  }
})

.controller('ChatsCtrl', function($scope, UserCatalog, Chat, Auth, $state) {
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
  });

  function findOrInitiateChat(userId){
    var newChat = new Chat({swiper_id: vm.currentUser, swipee_id: userId});
    newChat.$save().then(function(chat){
      console.log('chat created. Id is ' + chat)
      $state.go('tab.chat-detail', {'chatId': chat.chat_id});
    })

  }


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chat, Auth, User,$resource, $timeout, $interval,$ionicScrollDelegate) {
  var vm = this;
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  vm.chat = null;
  vm.otherUser = null;
  vm.messageToSend = null;
  vm.messages = [];
  vm.inputUp = inputUp;
  vm.inputDown = inputDown;
  vm.sendMessage = sendMessage;

  $scope.$on('$ionicView.enter', function(e) {
    vm.currentUser = Auth._currentUser;
    $ionicScrollDelegate.$getByHandle('messageScroll').scrollBottom(true);
    Chat.get({chatId: $stateParams.chatId}).$promise.then(function (chat) {
      vm.chat = chat;
      var otherUserQuery = vm.currentUser.id === chat.swiper_id ?
        User.get({userId: chat.swiper_id}) : User.get({userId: chat.swipee_id});
      otherUserQuery.$promise.then(function (otherUser) {
        vm.otherUser = otherUser;
        startRefresh();
      })
    })

  });

  $scope.$on('$ionicView.leave', function(e) {
    $interval.cancel(vm.messagesIntervalObj);
  })

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
    var prevLength = vm.messages.length
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

  function sendMessage(){
    var Message = $resource('http://localhost:3000/chats/:chatId/messages/:messageId',
      {chatId: vm.chat.id, messageId:'@id'});
    var newMessage = new Message({
      body: vm.messageToSend,
      chat_id: vm.chat.id,
      user_id: vm.currentUser.id
    });
    newMessage.$save().then(function(message){
      delete vm.messageToSend;
      console.log('message created. Id is ' + message)

    })

  }
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


.controller('AccountCtrl', function($scope,$log,Auth,$state, simpleAlertPopup) {
  var vm = this;
  vm.currentUser = Auth._currentUser;
  vm.settings = {
    enableFriends: true
  };
  vm.logout = logout;

  $scope.$on('$ionicView.enter', function(e) {
    vm.currentUser = Auth._currentUser;
  })

  function logout(){
    Auth.logout().then(function(oldUser) {
      simpleAlertPopup.show('Logged out',oldUser.first_name + ' , you have been logged out sucessfully.')
      $state.go('login');
    }, function(error) {

    });
  }
});

