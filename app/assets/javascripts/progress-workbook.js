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
    when('/cohorts', {
      templateUrl: 'templates/cohorts.html'
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

rest.factory('Sections', function($resource) { //Is this code correct?
  return $resource('/sections/:id', {});
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

  	Users.query(function(response) {
  		$scope.data.users = response;
  	});
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

    Students.query(function(response) {
      $scope.data.students = response;
    });
  }]);

// student details page
controllers.controller('StudentCtrl', ['$scope', '$routeParams', 'Students',
  function($scope, $routeParams, Students) {
    $scope.student = Students.get({id: $routeParams.id});
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

// student list
controllers.controller('ClassListCtrl', ['$scope', 'Sections',
  function($scope, Sections) {
    $scope.data = {};

    Sections.query(function(response) {
      $scope.data.sections = response;
    });
  }]);



//Sample code used for the Angular JS To Do sample
function TodoCtrl($scope) {
  $scope.todos = [
    {text:'learn angular', done:true},
    {text:'build an angular app', done:false}];
 
  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
}
