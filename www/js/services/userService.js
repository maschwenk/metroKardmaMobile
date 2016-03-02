angular.module('starter.services').factory('userService', function($http) {
  var o = {
  };

  o.get = function(id) {
    return $http.get('http://localhost:3000/users/' + id + '.json').then(function(res){
        return res.data
    }, function(err){
      console.log(err)
    })
  }

  return o
})