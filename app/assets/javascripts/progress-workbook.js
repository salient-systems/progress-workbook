angular.module('progress-workbook', []).
    config(function($routeProvider) {
      $routeProvider.
          when('/classes', {templateUrl: 'templates/classes.html'}).
          when('/class', {templateUrl: 'templates/class.html'}).
          when('/students', {templateUrl: 'templates/students.html'}).
          when('/performance', {templateUrl: 'templates/performance.html'}).
          when('/users', {templateUrl: 'templates/users.html'}).
          when('/cohorts', {templateUrl: 'templates/cohorts.html'}).
          otherwise({redirectTo: '/classes'});
    });

function MainCtrl($scope) {
  
}