angular.module('starter.controllers').controller('StationCtrl', function($scope, $state, $ionicPopup, $ionicModal, station, kardmaExchangeService, SwiperSwipeeRoleService, Auth){

  var vm = this;

  vm.station = station;
  vm.role = SwiperSwipeeRoleService.getCurrentRole();
  vm.currentUser = Auth._currentUser;

  kardmaExchangeService.getPendingExchangeForUser(vm.currentUser.id).then(function(exchange) {
    vm.pendingExchangeForUser = exchange;
  });

  if (vm.pendingExchangeForUser && vm.pendingExchangeForUser.station_id == vm.station.id) {
    $state.go('tab.map.pending', {stationId: vm.station.id})
  };



  $ionicModal.fromTemplateUrl('templates/tab-map-station.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

  vm.hideModal = function() {
    $scope.modal.hide()
  }

  vm.makeRequest = function() {
      //refine this logic about checking for exchange

      // if (vm.pendingExchangeForUser) {
      //   var confirmPopup = $ionicPopup.confirm({
      //     template: "You currently have a pending request elsewhere.  Click 'OK' to override your other request with this one."
      //   })
      //   confirmPopup.then(function(resp) {
      //         if(resp) {
      //           kardmaExchangeService.cancelThenCreate(vm.pendingExchangeForUser.id, vm.station.id, vm.role).then(function() {
      //               vm.hideModal();
      //               $state.go('tab.map.pending', {stationId: vm.station.id})
      //           })
      //         } else {
      //           console.log("You are not sure")
      //         }
      //       })

      // };

      kardmaExchangeService.create(vm.station.id, vm.role).then(function(res) {
          vm.hideModal();
          $state.go('tab.map.pending', {stationId: vm.station.id})
        }
      )
    }


})