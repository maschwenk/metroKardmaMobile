angular.module('starter.services').factory('userService', function($http, configurationService) {
  var o = {
  };

  o.get = function(id) {
    return $http.get(configurationService.getDomain() + '/users/' + id + '.json').then(function(res){
        return res.data
    }, function(err){
      console.log(err)
    })
  }

  return o
})