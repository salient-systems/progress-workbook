app = angular.module('pw', ['restangular', 'ngGrid']);

/**** Authentication ****/

app.factory('Token', function () {
  var token = '';
  var filter = '';

  return {
    returnToken: function () {
     return this.token;
    },
    returnFilter: function () {
      return this.filter;
    },
    setToken: function(token) {
      this.token = token;
    },
    setFilter: function(filter) {
      this.filter = filter;
    }
  };
});

app.factory('UserService', function () {
  var sdo = {
    isLogged: false,
    userName: '',
    userRole: 'admin'
  };

  return sdo;
});

/*
app.run(['$rootScope','$location', 'UserService',
  function ($rootScope, $location, UserService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

      if (next.clientLevel === UserService.userRole){
        console.log('Access granted: role matches');
      } else if (UserService.userRole != '') {
        if(next.clientLevel != UserService.userRole){
          console.log('current routelevel = ' + next.clientLevel + ' userService role = ' + UserService.userRole);
          $location.path('/classes');
        }
      } else if (UserService.userRole === '') {
        $location.path('/login');
      }
    });
  }
]);*/


/**** Configuration ****/

app.config(function($routeProvider, RestangularProvider) {
  //RestangularProvider.setDefaultHeaders({authToken: 'testTokenValue'});

  RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
    return {
      element: element,
      params: params,
      headers: _.extend(headers, {authToken: 'testTokenValue'})
    };
  });

  $routeProvider.
    when('/classes', {
      templateUrl: 'templates/sections.html',
      controller: 'SectionListCtrl'
    }).
    when('/classes/:section_id/assessment_type/:assessment_type_id/view/1', {
      templateUrl: 'templates/assessment1.html',
      controller: 'AssessmentCtrl'
    }).
    when('/classes/:section_id/assessment_type/:assessment_type_id/view/2', {
      templateUrl: 'templates/assessment2.html',
      controller: 'AssessmentCtrl'
    }).
    when('/classes/:section_id/assessment_type/:assessment_type_id/view/3', {
      templateUrl: 'templates/assessment3.html',
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
      controller: 'UserListCtrl',
      clientLevel: 'admin'
    }).
      when('/users/:id', {
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl',
      clientLevel: 'admin'
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
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    otherwise({redirectTo: '/classes'}); //change to /login after adding authentication
});

/**** Services ****/

// Bulk performance service
app.factory('graphConfig', function(Restangular) {
  var publicScope = {
    sectionStatistics: [
      { id: 1, name: "Total Correct" },
      { id: 2, name: "Percentage Correct" }
    ],

    assessmentTypeStatistics: [
      { id: 1, name: "Total Correct" },
      { id: 2, name: "Percentage Correct" },
      { id: 3, name: "Total Possible" },
      { id: 4, name: "Total Goal" },
      { id: 5, name: "Percent of Term" },
      { id: 6, name: "Score Distribution (Total)" },
      { id: 7, name: "Score Distribution (Percent)" },
      { id: 8, name: "Students Present" }
    ],

    assessmentStatistics: [
      { id: 1, name: "Total Correct" },
      { id: 2, name: "Percentage Correct" },
      { id: 3, name: "Total Possible" },
      { id: 4, name: "Total Goal" },
      { id: 6, name: "Score Distribution (Total)" },
      { id: 7, name: "Score Distribution (Percent)" },
    ],

    criterionStatistics: [
      { id: 6, name: "Score Distribution (Total)" },
      { id: 7, name: "Score Distribution (Percent)" },
    ],

    termId: null,
    sectionId: null,
    assessmentTypeId: null,
    assessmentId: null,
    criterionId:  null,
    statisticId: null,
    sections: [],
    assessmentTypes: [],
    assessments: [],
    criterions: [],
    assessmentLabel: null,
    criterionLabel: null,
    statistics: null,
    assessmentLabel: 'Assessment',
    criterionLabel: 'Criterion',

    /*
     * Set the section
     */
    setSection: function(sectionId) {
      this.sectionId = sectionId;
      this.updateSection();
    },

    /*
     * Update assessment types when section changes
     */
    updateSection: function() {
      var self = this;

      if (self.sectionId !== undefined) {
        Restangular.one('sections', self.sectionId).getList('assessment_types')
        .then(function(assessmenttypes) {
          self.assessmentTypes = assessmenttypes;
        });
      }

      self.statistics = self.sectionStatistics;
      self.statisticId = null;
      self.assessmentTypeId = null;
      self.assessmentId = null;
      self.criterionId = null;
      self.assessmentTypes = [];
      self.assessments = [];
      self.criterion = [];
    },

    /*
     * Update assessments when assessment type changes
     */
    updateAssessmentType: function() {
      var self = this;

      if (self.assessmentTypeId !== undefined) {
        Restangular.one('assessment_types', self.assessmentTypeId).getList('assessments').then(function(assessments) {
          self.assessments = assessments;
        });

        self.statisticId = null;
        self.statistics = self.assessmentTypeStatistics;

        var atype = _.findWhere(assessmentTypes, {id: assessmentTypeId});
        if (atype.view == 3) {
          self.assessmentLabel = 'Unit';
          self.criterionLabel = 'Standard';
        }
        else {
          self.assessmentLabel = 'Assessment';
          self.criterionLabel = 'Criterion';
        }
      } else {
        self.statisticId = null;
        self.statistics = self.sectionStatistics;
      }

      self.assessmentId = null;
      self.criterionId = null;
      self.assessments = [];
      self.criterion = [];
    },

    /*
     * Update criteria when assessment changes
     */
    updateAssessment: function() {
      var self = this;

      if (self.assessmentId !== undefined) {
        Restangular.one('assessments', self.assessmentId).getList('criterions').then(function(criterions) {
          self.criterions = criterions;
        });

        self.statisticId = null;
        self.statistics = self.assessmentStatistics;
      } else {
        self.statisticId = null;
        self.statistics = self.assessmentTypeStatistics;
      }

      self.criterionId = null;
      self.criterion = [];
    },

    /*
     * Change available statistics when criterion changes
     */
    updateCriterion: function() {
      var self = this;

      if (self.criterionId !== undefined) {
        self.statisticId = null;
        self.statistics = self.criterionStatistics;
      } else {
        self.statisticId = null;
        self.statistics = self.assessmentStatistics;
      }
    }
  };

  function setTerm(termId) {
    publicScope.sectionId = null;
    publicScope.assessmentTypeId = null;
    publicScope.assessmentId = null;
    publicScope.criterionId = null;
    publicScope.assessmentTypes = [];
    publicScope.assessments = [];
    publicScope.criterion = [];

    Restangular.one('terms', termId).getList('sections').then(function(sections) {
      publicScope.sections = sections;
    });
  }

  Restangular.all('terms').getList().then(function(theterms) {
    setTerm(theterms.length);
  });

  return publicScope;
});

/**** Directives ****/


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
