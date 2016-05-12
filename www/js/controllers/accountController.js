angular.module('starter.controllers').controller('AccountCtrl', function($scope,$log,Auth,$state, simpleAlertPopup) {
  var vm = this;
  vm.currentUser = Auth._currentUser;
  vm.settings = {
    enableFriends: true
  };
  vm.logout = logout;

  $scope.$on('$ionicView.enter', function(e) {
    vm.currentUser = Auth._currentUser;
  })

  function logout(){
    Auth.logout().then(function(oldUser) {
      simpleAlertPopup.show('Logged out',oldUser.first_name + ' , you have been logged out sucessfully.')
      $state.go('login');
    }, function(error) {

    });
  }
})