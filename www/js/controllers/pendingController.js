angular.module('starter.controllers').controller('PendingCtrl', function($scope, $stateParams, $state, $ionicModal,kardmaExchanges, station, exchange) {
  $scope.role = $stateParams.role;
  $scope.station = station;

  $ionicModal.fromTemplateUrl('templates/tab-map-pending.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

  $scope.cancelExchange = function() {
    kardmaExchanges.cancel(exchange.id).then(function() {
      $state.go('tab.map.station', {
        stationId: station.id, role: $stateParams.role
      })
    })
  }
})