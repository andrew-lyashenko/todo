'use strict';

require([
  'angular',
  'controllers/todo',
  'directives/todoFocus',
  'directives/onEnter',
], function (angular, todoCtrl, todoFocusDir, onEnterDir) {
  angular
    .module('todoApp', [todoFocusDir, onEnterDir])
    .controller('TodoCtrl', todoCtrl);
});