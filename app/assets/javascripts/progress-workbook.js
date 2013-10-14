/* 
 * Maps routes to controllers. Notice that the controller
 * module gets passed as an argument into the app constructor.
 */ 
var app = angular.module('pw', ['controllers']);
app.config(function($routeProvider) {
  $routeProvider.
      when('/classes', {templateUrl: 'templates/classes.html'}).
      when('/class', {templateUrl: 'templates/class.html', controller: 'ClassCtrl'}).
      when('/students', {templateUrl: 'templates/students.html'}).
      when('/performance', {templateUrl: 'templates/performance.html'}).
      when('/users', {templateUrl: 'templates/users.html', controller: 'UserCtrl'}).
      when('/cohorts', {templateUrl: 'templates/cohorts.html'}).
      otherwise({redirectTo: '/classes'});
});

/*
 * Create REST resources. The argument to 
 * the $resource function is the url of the REST API
 * corresponding to that resource.
 */ 
var rest = angular.module('rest', ['ngResource']);

rest.factory('Users', function($resource) {
	return $resource('/users', {});
});

rest.factory('Students', function($resource) {
  return $resource('/students', {});
});

/*
 * Controller definitions. Notice that we pass 'rest' into
 * the controllers constructor, which gives us access to
 * the REST module and its resources created above.
 */
var controllers = angular.module('controllers', ['rest']);

controllers.controller('UserCtrl', ['$scope', 'Users', function($scope, Users) {
	$scope.data	= {};
	
	Users.query(function(response) {
		$scope.data.users = response;
	});
}]);

controllers.controller('ClassCtrl', ['$scope', 'Students', function($scope, Students) {
  $scope.data = {};
  
  Students.query(function(response) {
    $scope.data.students = response;
  });
}]);

