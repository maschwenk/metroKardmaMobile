angular.module('starter.services').factory('stationService', function($http, configurationService) {
  var o = {
    stations: []
  };

  o.getAll = function() {
    return $http.get(configurationService.getDomain() + '/stations/').then(function(res) {
      return res.data;
    }, function (err) {
      console.log(err);
    })
  }

  o.get = function(id) {
    return $http.get(configurationService.getDomain() + '/stations/' + id + '.json').then(function(res){
        return res.data
    }, function(err){
      console.log(err)
    })
  }

  return o
})
