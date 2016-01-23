angular.module('starter.controllers').controller('StationCtrl', function($scope, $state, $ionicPopup, $ionicModal, station, kardmaExchangeService, SwiperSwipeeRoleService){

  var vm = this;

  vm.station = station;
  vm.role = SwiperSwipeeRoleService.getCurrentRole();

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

  vm.checkForExchangesAndCreate = function() {
      kardmaExchangeService.create(vm.station.id, vm.role).then(function(res) {
          if (res.data.errors) {
            //this branch occurs if the current user has another pending exchange open
            roleInOtherExchange = res.data.errors[0]
            stationOtherExchange = res.data.errors[1]
            idOtherExchange = res.data.errors[2]
            var confirmPopup = $ionicPopup.confirm({
              template: "You currently have a request as a " +roleInOtherExchange + " at " + stationOtherExchange + ".  Click 'OK' to override your other request with this one."
            })
            confirmPopup.then(function(resp) {
              if(resp) {
                kardmaExchangeService.cancelThenCreate(idOtherExchange, vm.station.id, vm.role).then(function() {
                    vm.hideModal();
                    $state.go('tab.map.pending', {stationId: vm.station.id})
                })
              } else {
                console.log("You are not sure")
              }
            })
        } else {
          vm.hideModal();
          $state.go('tab.map.pending', {stationId: vm.station.id})

        }
      })
    }


})