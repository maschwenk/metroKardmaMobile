angular.module('starter.controllers').controller('PendingCtrl', function($scope, $state, $ionicModal,kardmaExchangeService, SwiperSwipeeRoleService, exchange, $interval) {

  var vm = this;

  vm.exchange = exchange

  vm.role = SwiperSwipeeRoleService.getCurrentRole();
  // $scope.station = station;

  $ionicModal.fromTemplateUrl('templates/tab-map-pending.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

  vm.hideModal = function() {
    $scope.modal.hide()
  }

  startRefresh();

  $scope.$on('$ionicView.leave', function(e) {
    $interval.cancel(vm.exchangeIntervalObj);
  })

  $scope.$on("$destroy",function( event ) {
    $interval.cancel(vm.exchangeIntervalObj);
  });

  function startRefresh() {
    vm.exchangeIntervalObj = $interval(checkForMatch, 5000);
  }

  function checkForMatch() {
    kardmaExchangeService.get(vm.exchange.id).then(function(exchangeFromService){
      //if exchange has a chat, it means that there has been a match (chat only created when there's been a match)
      if (exchangeFromService.chat !== null) {
        var chatId = exchangeFromService.chat.id
        vm.hideModal();
        $state.go('tab.chat-detail', {'chatId': chatId});
      }
    })
  }

  $scope.cancelExchange = function() {
    kardmaExchangeService.cancel(vm.exchange.id).then(function() {
      vm.hideModal();
      $state.go('tab.map.station', {
        stationId: exchange.station_id
      })
    })
  }
})