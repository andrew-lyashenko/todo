'use strict';

define(['angular'], function (angular) {
  var moduleName = 'TodoFocusDirective';

  angular.module(moduleName, []).directive('todoFocus', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
      scope.$watch(attrs.todoFocus, function (val) {
        if (val) {
          $timeout(function () {
            element[0].focus();
          }, 0, false);
        }
      });
    };
  }]);

  return moduleName;
});