'use strict';

define(['angular'], function (angular) {
  var moduleName = 'OnEnterDirective';

  angular.module(moduleName, []).directive('onEnter', ['$timeout', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.onEnter);
          });
          event.preventDefault();
        }
      });
    };
  }]);

  return moduleName;
});