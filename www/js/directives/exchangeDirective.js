angular.module('starter.directives').directive('exchangeDirective', function() {
    return {
      scope: {
        exchange: '='
      },
      restrict: 'AE',
      templateUrl: '../templates/exchange.html',
      controller: 'exchangeController as exchangeCtl'
  }
  })