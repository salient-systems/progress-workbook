/*
 * Maps routes to controllers. Notice that the controller
 * module gets passed as an argument into the app constructor.
 */
var app = angular.module('pw', ['controllers']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/classes', {
      templateUrl: 'templates/classes.html',
      controller: 'ClassListCtrl'
    }).
    when('/class', {
      templateUrl: 'templates/class.html',
      controller: 'ClassCtrl'
    }).
    when('/students', {
      templateUrl: 'templates/students.html',
      controller: 'StudentListCtrl'
    }).
    when('/students/:id', {
      templateUrl: 'templates/student.html',
      controller: 'StudentCtrl'
    }).
    when('/performance', {
      templateUrl: 'templates/performance.html'
    }).
    when('/users', {
      templateUrl: 'templates/users.html',
      controller: 'UserListCtrl'
    }).
      when('/users/:id', {
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl'
    }).
    when('/cohorts', {
      templateUrl: 'templates/cohorts.html',
      controller: 'CohortListCtrl'
    }).
      when('/cohorts/:id', {
      templateUrl: 'templates/cohort.html',
      controller: 'CohortCtrl'
    }).
    otherwise({redirectTo: '/classes'});
});

/*
 * Create REST resources. The argument to
 * the $resource function is the url of the REST API
 * corresponding to that resource.
 */
var rest = angular.module('rest', ['ngResource']);

rest.factory('Users', function($resource) {
	return $resource('/users/:id', {});
});

rest.factory('Students', function($resource) {
  return $resource('/students/:id', {});
});

rest.factory('Sections', function($resource) {
  return $resource('/sections/:id', {});
});

rest.factory('Cohorts', function($resource) {
  return $resource('/cohorts/:id', {});
});

/*
 * Controller definitions. Notice that we pass 'rest' into
 * the controllers constructor, which gives us access to
 * the REST module and its resources created above.
 */
var controllers = angular.module('controllers', ['rest']);

// user list
controllers.controller('UserListCtrl', ['$scope', 'Users',
  function($scope, Users) {
  	$scope.data	= {};
  	$scope.predicate = 'lname';

  	Users.query(function(response) {
  		$scope.data.users = response;
  	});
  }]);

// user details page
controllers.controller('UserCtrl', ['$scope', '$routeParams', 'Users',
  function($scope, $routeParams, Users) {
    $scope.user = Users.get({id: $routeParams.id});
  }]);

// class details
controllers.controller('ClassCtrl', ['$scope', 'Students',
  function($scope, Students) {
    $scope.data = {};

    Students.query(function(response) {
      $scope.data.students = response;
    });
  }]);

// student list
controllers.controller('StudentListCtrl', ['$scope', 'Students',
  function($scope, Students) {
    $scope.data = {};
	$scope.checked_students = [];
	$scope.predicate = 'lname';

    Students.query(function(response) {
      $scope.data.students = response;
    });



  }]);

// student details page
controllers.controller('StudentCtrl', ['$scope', '$routeParams', 'Students',
  function($scope, $routeParams, Students) {
    $scope.student = Students.get({id: $routeParams.id});
    console.log($scope.student);
  }]);

// Class list
controllers.controller('ClassListCtrl', ['$scope', 'Sections',
  function($scope, Sections) {
    $scope.data = {};
    $scope.predicate = 'name';

    Sections.query(function(response) {
      $scope.data.sections = response;
      console.log($scope.data.sections);
    });
  }]);

// cohort list
controllers.controller('CohortListCtrl', ['$scope', 'Cohorts',
  function($scope, Cohorts) {
    $scope.data = {};

    Cohorts.query(function(response) {
      $scope.data.cohorts = response;
    });
  }]);

// cohort details page
controllers.controller('CohortCtrl', ['$scope', '$routeParams', 'Cohorts',
  function($scope, $routeParams, Cohorts) {
    $scope.cohort = Cohorts.get({id: $routeParams.id});
  }]);

// controller to highlight the active navigation link
function NavCtrl($scope, $location, $route) {
  var path;
  $scope.$on('$routeChangeSuccess', function() {
    $scope[path] = "";
    path = $location.path().substring(1);
    var end = path.indexOf('/');
    path = path.substring(0, end > 0 ? end : path.length);
    $scope[path] = "active";
  });
}