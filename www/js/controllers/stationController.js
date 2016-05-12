angular.module('starter.controllers').controller('StationCtrl', function($scope, $state, $ionicPopup, $ionicModal, station, kardmaExchangeService, SwiperSwipeeRoleService, Auth){

  var vm = this;

  vm.station = station;
  vm.role = SwiperSwipeeRoleService.getCurrentRole();
  vm.currentUser = Auth._currentUser;
  vm.allPendingExchanges = kardmaExchangeService.allPendingExchanges

  vm.stationPendingExchanges = []
  for (var i = 0; i < vm.allPendingExchanges.length; i++) {
    //this is duplicated logic from map controller -- think of ways to refactor
    var roleNeeded = vm.allPendingExchanges[i].swiper_id == null ? "swiper" : "swipee";
    if (vm.allPendingExchanges[i].station_id == station.id && roleNeeded == vm.role) {
      vm.stationPendingExchanges.push(vm.allPendingExchanges[i]);
    }
  }

  //send user to pending state if they have a pending exchange at this station
  // kardmaExchangeService.getPendingExchangeForUser(vm.currentUser.id).then(function(exchange) {
  //   vm.pendingExchangeForUser = exchange;
  // });

  // if (vm.pendingExchangeForUser && vm.pendingExchangeForUser.station_id == vm.station.id) {
  //   $state.go('tab.map.pending', {stationId: vm.station.id})
  // };




  $ionicModal.fromTemplateUrl('templates/tab-map-station.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

  $scope.$on('$ionicView.leave', function(e) {
    $scope.modal.remove();
  })

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

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
          var exchangeId = res.exchange_id;
          $state.go('tab.map.pending', {exchangeId: exchangeId})
        }
      )
    }


})