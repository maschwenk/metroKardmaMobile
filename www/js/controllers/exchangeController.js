angular.module('starter.controllers').controller('exchangeController', function($scope, Auth, Chat, $state, kardmaExchanges) {
      var vm = this;
      vm.currentUser = Auth._currentUser.id;

      vm.updateExchangeAndStartChat = function(exchangeId) {
        kardmaExchanges.updateWithMatch(exchangeId).then(function(response){
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
          $scope.hideModal();
          $state.go('tab.chat-detail', {'chatId': chat.chat_id});
        })

  }
})