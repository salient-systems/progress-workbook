var app = angular.module('pw', ['ngGrid', 'ngResource']);

/*
 * Maps routes to controllers. Notice that the controller
 * module gets passed as an argument into the app constructor.
 */

app.config(function($routeProvider) {
  $routeProvider.
    when('/classes', {
      templateUrl: 'templates/classes.html',
      controller: 'ClassListCtrl'
    }).
    when('/classes/:id', {
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
app.factory('Users', function($resource) {
	return $resource('/users/:id', {});
});

app.factory('Students', function($resource) {
  return $resource('/students/:id', {}, {update: {method: 'PUT'}});
});

app.factory('Sections', function($resource) {
  return $resource('/sections/:id', {});
});

app.factory('Cohorts', function($resource) {
  return $resource('/cohorts/:id', {});
});

app.factory('ClassStudents', function($resource) {
  return $resource('/sections/:id/students', {});
});

app.factory('CohortStudents', function($resource) {
  return $resource('/cohorts/:id/students', {});
});

app.factory('StudentClasses', function($resource) {
  return $resource('/students/:id/sections', {});
});

app.factory('UserClasses', function($resource) {
  return $resource('/users/:id/sections', {});
});

app.factory('ClassAssessments', function($resource) {
  return $resource('/sections/:id/assessment_types', {});
});

/*
 * Directives
 */
app.directive('ngBlur', function () {
  // AngularJS does not support the onBlur event (as well as the onFocus).
  // However, this can be overcome by adding a "simple" directive.
  // http://stackoverflow.com/questions/15647981/angularjs-and-ng-grid-auto-save-data-to-the-server-after-a-cell-was-changed
  return function (scope, elem, attrs) {
    elem.bind('blur', function () {
      scope.$apply(attrs.ngBlur);
    });
  };
});

app.directive('checkList', function() {
  return {
    scope: {
      list: '=checkList',
      value: '@'
    },
    link: function(scope, elem, attrs) {
      var handler = function(setup) {
        var checked = elem.prop('checked');
        var index = scope.list.indexOf(scope.value);

        if (checked && index == -1) {
          if (setup) elem.prop('checked', false);
          else scope.list.push(scope.value);
        } else if (!checked && index != -1) {
          if (setup) elem.prop('checked', true);
          else scope.list.splice(index, 1);
        }
      };

      var setupHandler = handler.bind(null, true);
      var changeHandler = handler.bind(null, false);

      elem.bind('change', function() {
        scope.$apply(changeHandler);
      });
      scope.$watch('list', setupHandler, true);
    }
  };
});

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
};