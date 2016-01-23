angular.module('starter.services').factory('stationService', function($http) {
  var o = {
    stations: []
  };

  o.getAll = function() {
    return $http.get('http://localhost:3000/stations/').then(function(res) {
      return res.data;
    }, function (err) {
      console.log(err);
    })
  }

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