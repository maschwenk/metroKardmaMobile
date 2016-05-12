angular.module('starter.controllers').controller('ChatsCtrl', function($scope, UserCatalog, Chat, Auth, $state, $stateParams) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //

  //SCHWENK'S OLD LOGIC:

  // var vm = this;
  // vm.allUsers = null;
  // vm.findOrInitiateChat = findOrInitiateChat;

  // $scope.$on('$ionicView.enter', function(e) {
  //   UserCatalog.query().$promise.then(function(users){
  //     vm.allUsers = users;
  //   });
  //   vm.currentUser = Auth._currentUser.id;
  // });

  // function findOrInitiateChat(userId){
  //   var newChat = new Chat({swiper_id: vm.currentUser, swipee_id: userId});
  //   newChat.$save().then(function(chat){
  //     console.log('chat created. Id is ' + chat)
  //     $state.go('tab.chat-detail', {'chatId': chat.chat_id});
  //   })

  // }


})