var app = angular.module('pw', ['restangular', 'ngGrid']);

/*
 * Maps routes to controllers. Notice that the controller
 * module gets passed as an argument into the app constructor.
 */
app.config(function($routeProvider) {
  $routeProvider.
    when('/classes', {
      templateUrl: 'templates/sections.html',
      controller: 'SectionListCtrl'
    }).
    when('/classes/:section_id/assessment_type/:assessment_type_id/view/:view_id', {
      templateUrl: 'templates/assessment.html',
      controller: 'AssessmentCtrl'
    }).
    when('/classes/:id', {
      templateUrl: 'templates/section.html',
      controller: 'SectionCtrl'
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
      templateUrl: 'templates/performance.html',
      controller: 'PerformanceCtrl',
      reloadOnSearch: false
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
      when('/settings', {
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    }).
      when('/help', {
      templateUrl: 'templates/help.html'
    }).
      when('/about', {
      templateUrl: 'templates/about.html'
    }).
      when('/login', {
      templateUrl: 'templates/login.html'
    }).
    otherwise({redirectTo: '/login'});
});

/*
app.factory('cache', function(Restangular) {
  var data = {};
  return {
    get: function (object, callback) {
      if (data[object] === undefined) {
        Restangular.all(object).getList().then(function(response) {
          data[object] = response;
          callback.call(this, data[object]);
        });
      } else {
        callback.call(this, data[object]);
      }
    }
  };
});*/

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

app.directive('ngFocus', function () {
  // AngularJS does not support the onBlur event (as well as the onFocus).
  // However, this can be overcome by adding a "simple" directive.
  // http://stackoverflow.com/questions/15647981/angularjs-and-ng-grid-auto-save-data-to-the-server-after-a-cell-was-changed
  return function (scope, elem, attrs) {
    elem.bind('focus', function () {
      scope.$apply(attrs.ngFocus);
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


app.directive('resize', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		scope.$watch(function () {
			return { 'h': w.height(), 'w': w.width() };
		}, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
			if(newValue.h < 500) {
			  newValue.h = 700;
			}
            //scope.windowWidth = newValue.w;
            var offset = 260;
            var gridHeight = (newValue.h - offset) + 'px';
            document.getElementById("var-height-grid").style.height=gridHeight;
            scope.style = function () {
				return {
                    'height': (newValue.h - offset) + 'px',
                    //'width': (newValue.w - 100) + 'px'
                };
			};

		}, true);

		w.bind('resize', function () {
			scope.$apply();
		});
	};
});

app.directive('resize2', function ($window) {
  return function (scope, element) {
    var w = angular.element($window);
    scope.$watch(function () {
      return { 'h': w.height(), 'w': w.width() };
    }, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;
      if(newValue.h < 500) {
        newValue.h = 700;
      }
            //scope.windowWidth = newValue.w;
            console.log($("#var-height-graph").height());
            console.log($("#var-height-assessment").height());
            var offset = 346 + Math.max($("#var-height-assessment").height(), $("#var-height-graph").height());
            if(offset > scope.windowHeight/2){
              newValue.h = 950;
            }
            var gridHeight = (newValue.h - offset) + 'px';
            document.getElementById("var-height-grid").style.height=gridHeight;
            scope.style = function () {
        return {
                    'height': (newValue.h - offset) + 'px',
                    //'width': (newValue.w - 100) + 'px'
                };
      };

    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  };
});

// controller to highlight the active navigation link
app.controller('NavCtrl', function($scope, $location, $route) {
  var path;
  $scope.$on('$routeChangeSuccess', function() {
    $scope[path] = "";
    path = $location.path().substring(1);
    var end = path.indexOf('/');
    path = path.substring(0, end > 0 ? end : path.length);
    $scope[path] = "active";
  });
});

//framework setup for the flot graph
app.directive('chart', function(){
  return{
  restrict: 'EA',
  link: function(scope, elem, attrs){
    var chart = null,
      options = {
        xaxis: {
          ticks:[[0,'Daft'],[1,'Punk']]
        },
        grid: {
          labelMargin: 10,
          backgroundColor: '#e2e6e9',
          color: '#ffffff',
          borderColor: null
        }
      };

      var data = scope[attrs.ngModel];
      // If the data changes somehow, update it in the chart
      scope.$watch(attrs.ngModel, function(v){
        if(!chart){
          chart = $.plot(elem, v , options);
          elem.show();
      }else{
        chart.setData(v);
        chart.setupGrid();
        chart.draw();
      }
    });
  }};
});