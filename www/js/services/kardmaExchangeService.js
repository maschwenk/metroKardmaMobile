angular.module('starter.services').factory('kardmaExchangeService', function($http, configurationService) {
  var o = {
  };

  o.get = function(id) {
    return $http.get(configurationService.getDomain() + '/kardma_exchanges/' + id + '.json').then(function(res) {
        return res.data;
    });
  }

  o.getAll = function() {
    return $http.get(configurationService.getDomain() + '/kardma_exchanges.json').then(function(res) {
        return res.data;
    });
  }

  o.create = function(stationId, role) {
    return $http.post(configurationService.getDomain() + '/kardma_exchanges', {'station_id': stationId, 'role': role}).then(function(res) {
        return res.data;
    })
  };

  o.cancel = function(id) {
    return $http.delete(configurationService.getDomain() + '/kardma_exchanges/' + id + '.json').then(function(response) {

    })
  };

  o.updateWithMatch = function(id) {
    return $http.put(configurationService.getDomain() + '/kardma_exchanges/update_with_match/' + id + '.json')
  };

  o.completeExchange = function(id) {
    return $http.put(configurationService.getDomain() + '/kardma_exchanges/update_with_complete/' + id + '.json').then(function(res) {
      return res.data;
    })
  }

  o.cancelThenCreate= function(idToCancel, newStationId, role)  {
    return $http.delete(configurationService.getDomain() + '/kardma_exchanges/' + idToCancel + '.json').then(function(response) {
        $http.post(configurationService.getDomain() + '/kardma_exchanges', {'station_id': newStationId, 'role': role})
    })
  };

  o.getPendingExchangeForUser = function(userId) {
    return $http.get(configurationService.getDomain() + '/kardma_exchanges/pending_exchange/' + userId + '.json').then(function(res) {
      return res.data;
    })
  }


  o.setAllExchanges = function(exchanges) {
    o.allExchanges = exchanges
  };

  o.getAllPendingExchanges = function () {
    o.allPendingExchanges = []
    for (var i = 0; i < o.allExchanges.length; i++) {
      if (o.allExchanges[i].complete == false && (o.allExchanges[i].swiper_id == null || o.allExchanges[i].swipee_id == null)) {
        o.allPendingExchanges.push(o.allExchanges[i]);
      }
    }
    return o.allPendingExchanges
  }

  return o;
});