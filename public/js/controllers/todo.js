'use strict';

define(['angular', 'lodash'], function (angular, _) {
  return ['$scope', '$http', function ($scope, $http) {

    $scope.todos        = [];
    $scope.newTodo      = '';
    $scope.editedTodo   = null;
    $scope.originalTodo = null;

    $http.get('/todos').success(function (data) {
      $scope.todos = data;
    });

    $scope.$watch('todos', function () {
      $scope.todosCount          = $scope.todos.length;
      $scope.todosDone           = _.filter($scope.todos, {done: true});
      $scope.todosDoneCount      = $scope.todosDone.length;
      $scope.todosRemainingCount = $scope.todosCount - $scope.todosDoneCount;
    }, true);

    $scope.addTodo = function () {
      var newTodo = $scope.newTodo.trim();
      if (!newTodo.length) return;
      $http.post('/todo', {title: newTodo}).success(function (data) {
        $scope.todos.unshift(data);
      });
      $scope.newTodo = '';
    };

    $scope.toggleTodo = function(todo) {
      $http.put('/todo/' + todo.id, {done: todo.done});
    }

    $scope.removeTodo = function (todo) {
      _.remove($scope.todos, todo);
      $http.delete('/todo/' + todo.id);
    };

    $scope.clearDoneTodos = function () {
      var ids = _.map($scope.todosDone, function (todo) {
        return todo.id;
      });
      $http.post('/todo/mass-destroy', {ids: ids}).success(function () {
        _.remove($scope.todos, function (todo) {
          return todo.done;
        });
      });
    };

    $scope.editTodo = function (todo) {
      $scope.editedTodo   = todo;
      $scope.originalTodo = angular.copy(todo);
    };

    $scope.doneEditing = function (todo) {
      if (!$scope.editedTodo) return;
      $scope.editedTodo = null;
      if (!todo.title) return $scope.removeTodo(todo);
      if ($scope.originalTodo.title == todo.title) return;
      $http.put('/todo/' + todo.id, {title: todo.title});
    };

    $scope.todoStateIcon = function (todo) {
      if (todo == $scope.editedTodo) return 'fa-edit';
      return todo.done ? 'fa-check-square-o' : 'fa-square-o';
    };

  }];
});