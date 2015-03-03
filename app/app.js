'use strict';

var app = angular.module('myApp', []);

app.controller("MainController", function($scope){
  $scope.hello = "HELLO WORLD!";
});
