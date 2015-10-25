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
});
