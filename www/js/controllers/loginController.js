angular.module('starter.controllers').controller('LoginCtrl', function($scope, $log,$state, $location, UserSession, $ionicPopup, $rootScope, Auth) {
  var vm = this;
  vm.loginCredentials = {
    email: 'bill@gmail.com',
    password: 'password'
  };
  vm.login = function() {
    Auth.login(vm.loginCredentials, {}).then(function(user) {
      $log.info('user is '+ JSON.stringify(user))
      $state.go('swiper-swipee-choice')
    }, function(err) {
      var error = "";
      if(err){
        error = err["data"]["error"] || err.data.join('. ');
      }
      var confirmPopup = $ionicPopup.alert({
          title: 'An error occured',
          template: error
      });
    });
  }
})