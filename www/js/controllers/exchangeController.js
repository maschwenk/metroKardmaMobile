angular.module('starter.controllers').controller('exchangeController', function($scope, Auth, Chat, $state, kardmaExchangeService, SwiperSwipeeRoleService, userService) {
      var vm = this;
      vm.role = SwiperSwipeeRoleService.getCurrentRole();
      vm.currentUser = Auth._currentUser.id;

      vm.waiterId = vm.role == "swiper" ? $scope.exchange.swipee_id : $scope.exchange.swiper_id;

      userService.get(vm.waiterId).then(function(userFromService) {
        vm.waiter = userFromService;
      })

      vm.updateExchangeAndStartChat = function(exchangeId) {
        kardmaExchangeService.updateWithMatch(exchangeId).then(function(response){
            var exchangeId = response.data.exchange_id
            console.log(exchangeId)
            //logic for starting the chat goes here
            vm.startChat(exchangeId)
        })
      }

      vm.startChat = function(exchangeId) {
        var newChat = new Chat({exchange_id: exchangeId})
        newChat.$save().then(function(chat){
          console.log('chat created. Id is ' + chat)
          $state.go('tab.chat-detail', {'chatId': chat.chat_id});
        })

  }
})