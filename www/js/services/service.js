angular.module('starter.services', [])

.factory('configurationService', function(DOMAIN_CONFIG) {
    var srv = {};

    srv.getDomain= function() {
      return DOMAIN_CONFIG.DOMAIN_NAME
    }

    return srv;
})

.factory('Chat', function($resource, configurationService) {
  // Might use a resource here that returns a JSON array

  // Some fake testing date
  return $resource(configurationService.getDomain() + '/chats/:chatId');
})
.factory('Message', function($resource, configurationService) {
  return $resource(configurationService.getDomain() + '/chats/:chatId/messages/:messageId');
})
.factory('UserCatalog', function($resource, configurationService) {
  return $resource(configurationService.getDomain() + '/users/');
})
.factory('User', function($resource, configurationService) {
  return $resource(configurationService.getDomain() + '/users/:userId');
})
.factory("FirebaseChat", function($firebaseArray) {
  var chats = new Firebase("https://burning-inferno-6075.firebaseio.com/chats");
  return $firebaseArray(chats);
})
.factory('UserSession', function($resource, configurationService) {
  return $resource(configurationService.getDomain() + '/users/sign_in.json');
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
