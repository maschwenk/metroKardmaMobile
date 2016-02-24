angular.module('starter.controllers').controller('ChatDetailCtrl', function($scope, $stateParams, Chat, Auth, User,$resource, $timeout, $interval,$ionicScrollDelegate, SwiperSwipeeRoleService, kardmaExchangeService, $state) {
  var vm = this;
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  vm.chat = null;
  vm.otherUser = null;
  vm.exchange = null;
  vm.messageToSend = null;
  vm.messages = [];
  vm.inputUp = inputUp;
  vm.inputDown = inputDown;
  vm.sendMessage = sendMessage;
  vm.role = SwiperSwipeeRoleService.getCurrentRole();
  vm.sendKardma = sendKardma;

  $scope.$on('$ionicView.enter', function(e) {
    vm.currentUser = Auth._currentUser;
    $ionicScrollDelegate.$getByHandle('messageScroll').scrollBottom(true);
    Chat.get({chatId: $stateParams.chatId}).$promise.then(function (chat) {
      vm.chat = chat;
      vm.exchange = vm.chat.kardma_exchange;
      var otherUserQuery = vm.currentUser.id === vm.exchange.swiper_id ?
        User.get({userId: vm.exchange.swipee_id}) : User.get({userId: vm.exchange.swiper_id});
      otherUserQuery.$promise.then(function (otherUser) {
        vm.otherUser = otherUser;
        startRefresh();
      })
    })

  });

  $scope.$on('$ionicView.leave', function(e) {
    $interval.cancel(vm.messagesIntervalObj);
    $interval.cancel(vm.checkForCompletionInterval);
  })

  $scope.$on("$destroy",function( event ) {
    $interval.cancel(vm.messagesIntervalObj);
    $interval.cancel(vm.checkForCompletionInterval);
  });

  function inputUp() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  }

  function inputDown() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  }

  function startRefresh(){
    vm.messagesIntervalObj = $interval(getAllMessages, 1000);
    vm.checkForCompletionInterval = $interval(checkForCompletion, 10000);
  }

  function getAllMessages(){
    var Messages = $resource('http://localhost:3000/chats/:chatId/messages/',
      {chatId: vm.chat.id});
    //very simplistic change detection, other ways of doing this
    var prevLength = vm.messages.length
    Messages.query().$promise.then(function(messages){
      vm.messages = messages;
      if(prevLength < vm.messages.length){
        $ionicScrollDelegate.$getByHandle('messageScroll').scrollBottom(true);
      }
    });
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('messageScroll').resize();
    });


  }

  function checkForCompletion() {
    kardmaExchangeService.get(vm.exchange.id).then(function(exchangeFromService) {
        if (exchangeFromService.complete) {
          vm.exchange.complete = true;
          $state.go('swiper-swipee-choice')
        }
    })
  }

  function sendMessage(){
    var Message = $resource('http://localhost:3000/chats/:chatId/messages/:messageId',
      {chatId: vm.chat.id, messageId:'@id'});
    var newMessage = new Message({
      body: vm.messageToSend,
      chat_id: vm.chat.id,
      user_id: vm.currentUser.id
    });
    newMessage.$save().then(function(message){
      delete vm.messageToSend;
      console.log('message created. Id is ' + message)

    })

  }

  function sendKardma(exchangeId) {
    kardmaExchangeService.completeExchange(exchangeId).then(function(exchangeFromService) {
      if (exchangeFromService.complete) {
        vm.exchange.complete = true;
      }
    })
  }
})