angular.module('starter.directives').directive('exchangeDirective', function() {
    return {
      scope: {
        exchange: '=',
        hideModal: '&'
      },
      restrict: 'AE',
      templateUrl: '../templates/exchange.html',
      controller: 'exchangeController as exchangeCtl'
  }
  })