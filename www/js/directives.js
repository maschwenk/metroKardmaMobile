/**
 * Created by maxschwenk on 11/7/15.
 */

angular.module('starter.directives', [])
  .directive('input', chatInput)
  .directive('exchangeWaiting', function() {
    return {
      scope: {
        exchange: '=',
        waiter: '=',
        hideModal: '&'
      },
      restrict: 'AE',
      template: '<p ng-click="updateExchangeAndStartChat(exchange.id)">{{waiter.first_name}}: (Average Rating: {{waiter.average_rating}})</p>',
      controller: function($scope, $stateParams, Auth, Chat, $state, kardmaExchanges) {
          var vm = this;
          vm.currentUser = Auth._currentUser.id;

          $scope.updateExchangeAndStartChat = function(exchangeId) {
            kardmaExchanges.updateWithMatch(exchangeId).then(function(response){
                var exchangeId = response.data.exchange_id
                console.log(exchangeId)
                //logic for starting the chat goes here
                $scope.startChat(exchangeId)
            })
          }

          $scope.startChat = function(exchangeId) {
            // if ($stateParams.role == "swiper") {
            //   var newChat = new Chat({swiper_id: vm.currentUser, swipee_id: otherUserId});
            // } else if ($stateParams.role == "swipee") {
            //   var newChat = new Chat({swiper_id: otherUserId, swipee_id: vm.currentUser});
            // }
            var newChat = new Chat({exchange_id: exchangeId})
            newChat.$save().then(function(chat){
              console.log('chat created. Id is ' + chat)
              $scope.hideModal();
              $state.go('tab.chat-detail', {'chatId': chat.chat_id});
            })

      }
    }
  }
  })

/*
  This is basically overriding the existing normal <input> directive. I am not sure of the ramifications
  doing this, however, I am not sure of a way to extend the original functionality of an input directive in angular.

 */
function chatInput($timeout) {
  return {
    restrict: 'E',
    scope: {},
    controller: function(){},
    controllerAs: 'inputCtl',
    bindToController: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr, inputCtl) {
      element.bind('focus', function(e) {
        if (inputCtl.onFocus) {
          $timeout(function() {
            inputCtl.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (inputCtl.onBlur) {
          $timeout(function() {
            inputCtl.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (inputCtl.returnClose) element[0].blur();
          if (inputCtl.onReturn) {
            $timeout(function() {
              inputCtl.onReturn();
            });
          }
        }
      });
    }
  }
}


