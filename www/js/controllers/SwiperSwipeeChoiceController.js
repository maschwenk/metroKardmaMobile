angular.module('starter.controllers').controller('SwiperSwipeeChoiceCtl', function ($state, $log){
    var vm = this;
    vm.goToMap = goToMap;
    function goToMap(swiperOrSwipee){
      $log.info('going to Map as ' + swiperOrSwipee);
      $state.go('tab.map', {'role': swiperOrSwipee});
    }
})