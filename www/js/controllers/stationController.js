angular.module('starter.controllers').controller('StationCtrl', function($scope, $stateParams, $state, $ionicPopup, $ionicModal, station, kardmaExchanges, SwiperSwipeeRoleService){
  $scope.station = station;
  $scope.role = SwiperSwipeeRoleService.getCurrentRole();

  $ionicModal.fromTemplateUrl('templates/tab-map-station.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

  $scope.hideModal = function() {
    $scope.modal.hide()
  }

  $scope.checkForExchangesAndCreate = function() {
      kardmaExchanges.create($stateParams.stationId, $scope.role).then(function(res) {
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
                kardmaExchanges.cancelThenCreate(idOtherExchange, $stateParams.stationId, $scope.role).then(function() {
                    $scope.hideModal();
                    $state.go('tab.map.pending', {stationId: station.id})
                })
              } else {
                console.log("You are not sure")
              }
            })
        } else {
          $scope.hideModal();
          $state.go('tab.map.pending', {stationId: station.id})

        }
      })
    }


})