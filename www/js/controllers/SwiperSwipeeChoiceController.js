angular.module('starter.controllers').controller('SwiperSwipeeChoiceCtl', function ($state, $log, SwiperSwipeeRoleService, userService, Auth){
    var vm = this;
    vm.goToMap = goToMap;
    vm.setRoleAndGoToMap = setRoleAndGoToMap;
    vm.currentUser = Auth._currentUser;

    userService.get(vm.currentUser.id).then(function(response) {
        userService.curUserKardmaCount = response.kardma_count;
        userService.curUserAvgRating = response.average_rating;

        vm.curUserKardmaCount = userService.curUserKardmaCount
    })



    function setRoleAndGoToMap (role) {
        SwiperSwipeeRoleService.setCurrentRole(role);
        goToMap(role);
    }

    function goToMap(swiperOrSwipee){
      $log.info('going to Map as ' + swiperOrSwipee);
      $state.go('tab.map');
    }
})