/**
 * Created by maxschwenk on 11/7/15.
 */

angular.module('starter.directives', [])
  .directive('input', chatInput)
  .directive('personWaiting', function() {
    return {
      scope: {
        waiter: '='
      },
      restrict: 'AE',
      template: '<p ng-click="sayHello()">{{waiter.first_name}}: (Average Rating: {{waiter.average_rating}})</p>',
      controller: function($scope) {
          $scope.sayHello = function(){
            alert("Hello There")
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


