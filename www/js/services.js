angular.module('starter.services', [])

.factory('Chats', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing date
  return $resource('http://localhost:3000/chats/:id');
})
.factory('Users', function() {
    var service = {};
    service.currentUser = null;
    return service;
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

.factory('kardmaExchanges', function($http) {
  var o = {
    kardmaExchanges: []
  };

  o.create = function(stationId, role) {
    return $http.post('http://localhost:3000/kardma_exchanges', {'station_id': stationId, 'role': role})
  };

  o.cancel = function(id) {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + id + '.json').then(function(response) {

    })
  };

  o.cancelThenCreate= function(idToCancel, newStationId, role)  {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + idToCancel + '.json').then(function(response) {
        $http.post('http://localhost:3000/kardma_exchanges', {'station_id': newStationId, 'role': role})
    })
  }

  return o
});
