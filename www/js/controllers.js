function buildPrivatePub(doc) {
  var self = {
    connecting: false,
    fayeClient: null,
    fayeCallbacks: [],
    subscriptions: {},
    subscriptionObjects: {},
    subscriptionCallbacks: {},

    faye: function(callback) {
      if (self.fayeClient) {
        callback(self.fayeClient);
      } else {
        self.fayeCallbacks.push(callback);
        if (self.subscriptions.server && !self.connecting) {
          self.connecting = true;
          var script = doc.createElement("script");
          script.type = "text/javascript";
          script.src = self.subscriptions.server + ".js";
          script.onload = self.connectToFaye;
          doc.documentElement.appendChild(script);
        }
      }
    },

    connectToFaye: function() {
      self.fayeClient = new Faye.Client(self.subscriptions.server);
      self.fayeClient.addExtension(self.fayeExtension);
      for (var i=0; i < self.fayeCallbacks.length; i++) {
        self.fayeCallbacks[i](self.fayeClient);
      };
    },

    fayeExtension: {
      outgoing: function(message, callback) {
        if (message.channel == "/meta/subscribe") {
          // Attach the signature and timestamp to subscription messages
          var subscription = self.subscriptions[message.subscription];
          if (!message.ext) message.ext = {};
          message.ext.private_pub_signature = subscription.signature;
          message.ext.private_pub_timestamp = subscription.timestamp;
        }
        callback(message);
      }
    },

    sign: function(options) {
      if (!self.subscriptions.server) {
        self.subscriptions.server = options.server;
      }
      self.subscriptions[options.channel] = options;
      self.faye(function(faye) {
        var sub = faye.subscribe(options.channel, self.handleResponse);
        self.subscriptionObjects[options.channel] = sub;
        if (options.subscription) {
          options.subscription(sub);
        }
      });
    },

    handleResponse: function(message) {
      if (message.eval) {
        eval(message.eval);
      }
      if (callback = self.subscriptionCallbacks[message.channel]) {
        callback(message.data, message.channel);
      }
    },

    subscription: function(channel) {
      return self.subscriptionObjects[channel];
    },

    unsubscribeAll: function() {
      for (var i in self.subscriptionObjects) {
        if ( self.subscriptionObjects.hasOwnProperty(i) ) {
          self.unsubscribe(i);
        }
      }
    },

    unsubscribe: function(channel) {
      var sub = self.subscription(channel);
      if (sub) {
        sub.cancel();
        delete self.subscriptionObjects[channel];
      }
    },

    subscribe: function(channel, callback) {
      self.subscriptionCallbacks[channel] = callback;
    }
  };
  return self;
}

var PrivatePub = buildPrivatePub(document);

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
  });

  function findOrInitiateChat(userId){
    vm.currentUser = Auth._currentUser.id;
    var newChat = new Chat({swiper_id: vm.currentUser, swipee_id: userId});
    newChat.$save().then(function(chat){
      console.log('chat created. Id is ' + chat)
      $state.go('tab.chat-detail', {'chatId': chat.chat_id});
    })

  }


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chat, Auth, User,$resource, $timeout) {
  var vm = this;
  vm.chat = null;
  vm.currentUser = Auth._currentUser;
  vm.otherUser = null;
  vm.messages = [];

  PrivatePub.subscribe("localhost:9292/messages/new", function(data, channel) {
    console.log(data);
    //vm.messages.push(data.chat_message);
  });


  Chat.get({chatId : $stateParams.chatId}).$promise.then(function(chat){
    vm.chat = chat;
    var otherUserQuery = vm.currentUser.id === chat.swiper_id ?
                          User.get({userId : chat.swiper_id }) :  User.get({userId : chat.swipee_id });
    otherUserQuery.$promise.then(function(otherUser){
      vm.otherUser = otherUser;
      createNewMessage();
    })
  })

  function createNewMessage(){
    var Message = $resource('http://localhost:3000/chats/:chatId/messages/:messageId',
      {chatId: vm.chat.id, messageId:'@id'});
    var newMessage = new Message({
      body: 'Hey pal',
      chat_id: vm.chat.id,
      user_id: vm.currentUser.id
    });
    newMessage.$save().then(function(message){
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


.controller('AccountCtrl', function($scope,$log,Auth) {
  var vm = this;
  vm.currentUser = Auth._currentUser;

  vm.settings = {
    enableFriends: true
  };
});

