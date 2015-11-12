angular.module('starter.services', [])

.factory('Chat', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing date
  return $resource('http://localhost:3000/chats/:chatId');
})
.factory('Message', function($resouce) {
  return $resource('http://localhost:3000/chats/:chatId/messages/:messageId');
})
.factory('UserCatalog', function($resource) {
  return $resource('http://localhost:3000/users/');
})
.factory('User', function($resource) {
  return $resource('http://localhost:3000/users/:userId');
})
.factory("FirebaseChat", function($firebaseArray) {
  var chats = new Firebase("https://burning-inferno-6075.firebaseio.com/chats");
  return $firebaseArray(chats);
})
.factory('UserSession', function($resource) {
  return $resource("http://localhost:3000/users/sign_in.json");
})
.factory('Stations', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  return $resource('http://localhost:3000/stations/', {}, {
        queryAll: {
            method: 'GET',
            cache: false,
            isArray: true
        }
    });
  //return $http.get()
  //return $resource("http://localhost:3000/stations/");
})

.factory('Station', function($http) {
  var o = {
    stations: []
  };

  o.get = function(id, role) {
    return $http.get('http://localhost:3000/stations/' + id + '.json', {params: {user_role: role}}).then(function(res){
        return res.data
    }, function(err){
      console.log(err)
    })
  }

  return o
})
.factory('simpleAlertPopup', function($ionicPopup){
  var o = {};
  o.show = show;
  return o;

  function show(title,body){
    return $ionicPopup.alert({
      title: title,
      template: body
    });
  }
})
.factory('kardmaExchanges', function($http) {
  var o = {
    kardmaExchanges: []
  };

  o.create = function(stationId, role) {
    return $http.post('http://localhost:3000/kardma_exchanges', {'station_id': stationId, 'role': role})
  };

  o.cancel = function(id) {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + id + '.json')
  };

  o.cancelThenCreate= function(idToCancel, newStationId, role)  {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + idToCancel + '.json').then(function(response) {
        return $http.post('http://localhost:3000/kardma_exchanges', {'station_id': newStationId, 'role': role})
    })
  };

  o.update = function(id, role) {
    return $http.put('http://localhost:3000/kardma_exchanges/' + id + '.json', {'role': role})
  };

  o.cancelThenUpdate = function(idToCancel, newExchangeId, role) {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + idToCancel + '.json').then(function(response) {
        return $http.put('http://localhost:3000/kardma_exchanges/' + newExchangeId + '.json', {'role': role})
    })
  }

  return o
});
