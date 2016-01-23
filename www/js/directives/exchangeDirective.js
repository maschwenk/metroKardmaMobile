angular.module('starter.directives').directive('exchangeDirective', function() {
    return {
      scope: {
        exchange: '=',
        waiter: '=',
        hideModal: '&'
      },
      restrict: 'AE',
      templateUrl: '../templates/exchange.html',
      controller: 'exchangeController as exchangeCtl'
  }
  })