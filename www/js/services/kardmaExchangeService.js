angular.module('starter.services').factory('kardmaExchangeService', function($http) {
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

  o.updateWithMatch = function(id) {
    return $http.put('http://localhost:3000/kardma_exchanges/update_with_match/' + id + '.json')
  }

  o.cancelThenCreate= function(idToCancel, newStationId, role)  {
    return $http.delete('http://localhost:3000/kardma_exchanges/' + idToCancel + '.json').then(function(response) {
        $http.post('http://localhost:3000/kardma_exchanges', {'station_id': newStationId, 'role': role})
    })
  }

  return o
});