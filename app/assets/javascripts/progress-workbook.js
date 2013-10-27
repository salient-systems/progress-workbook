/*
 * Maps routes to controllers. Notice that the controller
 * module gets passed as an argument into the app constructor.
 */
var app = angular.module('pw', ['controllers','ngGrid']);

angular.module('pw').filter('startFrom', function() {
    return function(input, start) {
        return input.slice(start);
	};
});



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
  return $resource('/students/:id', {}, {update: {method: 'PUT'}});
});

rest.factory('Sections', function($resource) {
  return $resource('/sections/:id', {});
});

rest.factory('Cohorts', function($resource) {
  return $resource('/cohorts/:id', {});
});

rest.factory('ClassStudents', function($resource) {
  return $resource('/sections/:id/students', {});
});

rest.factory('CohortStudents', function($resource) {
  return $resource('/cohorts/:id/students', {});
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

    $scope.data.students = ClassStudents.query({id: $routeParams.id});

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
	$scope.students = Students.query();
	$scope.myData = $scope.students;
	$scope.mySelections = [];
	$scope.cellValue;
	var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"number\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";

    $scope.gridOptions = {
	    data: 'myData',
	    selectedItems: $scope.mySelections,
	    multiSelect: true,
	    showSelectionCheckbox: true,
	    selectWithCheckboxOnly: true,
	    enableCellEditOnFocus: true,
	    filterOptions: {filterText: '', useExternalFilter: false},
	    columnDefs: [ { field: 'fname', displayName: 'First Name', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a></div>'},
	                  { field: 'lname', displayName: 'Last Name', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a></div>'},
	                  { field: 'grade_level', displayName: 'Grade Level', enableCellEdit: true, editableCellTemplate: cellEditableTemplate},
	                  //{ displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'}
	                ],
	    afterSelectionChange: function () {
	    $scope.selectedIDs = [];
		    angular.forEach($scope.mySelections, function ( item ) {
		        $scope.selectedIDs.push( item.id );
		    });
        }
    };

   	$scope.updateEntity = function(column, row, cellValue) {
	    console.log(row.entity);
	    console.log(column.field);
	    console.log('Cell Value prior: ' + row.entity[column.field]);
	    console.log('Cell Value after: ' + cellValue);
	    var student = $scope.students.query({id: row.entity.id});
	    console.log('students id: ' + $scope.students[row].id);

	    // back end logic to update new cell value
	    if (cellValue != row.entity[column.field]){
	    	student.grade_level = cellValue;
	    	student.$save();
	    }
	    // Upon sucessfull back end update
	    row.entity[column.field] = cellValue;
  	};
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
controllers.controller('CohortCtrl', ['$scope', '$routeParams', 'Cohorts', 'CohortStudents',
  function($scope, $routeParams, Cohorts, CohortStudents) {
    $scope.cohort = Cohorts.get({id: $routeParams.id});

    $scope.data = {};
    $scope.data.students = CohortStudents.query({id: $routeParams.id});
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
};


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
