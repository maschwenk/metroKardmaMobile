angular.module('starter.controllers').controller('SwiperSwipeeChoiceCtl', function ($state, $log, SwiperSwipeeRoleService){
    var vm = this;
    vm.goToMap = goToMap;
    vm.setRoleAndGoToMap = setRoleAndGoToMap;

    function setRoleAndGoToMap (role) {
        SwiperSwipeeRoleService.setCurrentRole(role);
        goToMap(role);
    }

    function goToMap(swiperOrSwipee){
      $log.info('going to Map as ' + swiperOrSwipee);
      $state.go('tab.map');
    }
})