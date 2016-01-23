angular.module('starter.controllers').controller('PendingCtrl', function($scope, $state, $ionicModal,kardmaExchangeService, station, exchange, SwiperSwipeeRoleService) {
  $scope.role = SwiperSwipeeRoleService.getCurrentRole();
  $scope.station = station;

  $ionicModal.fromTemplateUrl('templates/tab-map-pending.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

  $scope.hideModal = function() {
    $scope.modal.hide()
  }

  $scope.cancelExchange = function() {
    kardmaExchangeService.cancel(exchange.id).then(function() {
      $scope.hideModal();
      $state.go('tab.map.station', {
        stationId: station.id
      })
    })
  }
})