angular.module('starter.services', [])

.factory('Chat', function($resource) {
  // Might use a resource here that returns a JSON array

  // Some fake testing date
  return $resource('http://localhost:3000/chats/:chatId');
})
.factory('Message', function($resource) {
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
