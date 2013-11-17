// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {



  $scope.defaultPanel = {
    id: 1,
    open: true,
    searchCriteria: "",
    termId: null,
    sectionId: null,
    assessmentTypeId: null,
    assessmentId: null,
    criterionId:  null,
    statistic: null,
    sections: [],
	  assessmentTypes: [],
	  assessments: [],
	  criterions: []
  };

  $scope.panels = [angular.copy($scope.defaultPanel)];

  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
    $scope.panels[0].termId = $scope.terms.length;
    Restangular.one('terms', $scope.panels[0].termId).getList('sections').then(function(sections) {
      $scope.panels[0].sections = sections;

      // add student typeahead
      $('input.search').typeahead([{
        name: 'students',
        limit: 3,
        header: '<h4>Students</h4>',
        prefetch: {
          url: '/students/search.json',
          ttl: 0
        }
      }, {
        name: 'cohorts',
        limit: 3,
        header: '<h4>Cohorts</h4>',
        prefetch: {
          url: '/cohorts/search.json',
          ttl: 0
        }
      }, {
        name: 'users',
        limit: 3,
        header: '<h4>Users</h4>',
        prefetch: {
          url: '/users/search.json',
          ttl: 0
        }
      }]);

      $('.tt-query').css('background-color','#fff');

    });
  });
});

// Chart Controller
app.controller('ChartCtrl', function($scope){
  var daftPoints = [[0, 4]], punkPoints = [[1, 20]];
  var data1 = [
    {
      data: daftPoints,
      color: '#00b9d7',
      bars: {show: true, barWidth:1, fillColor: '#00b9d7', order: 1, align: "center" }
    }, {
      data: punkPoints,
      color: '#3a4452',
      bars: {show: true, barWidth:1, fillColor: '#3a4452', order: 2, align: "center" }
    }
  ];
  $scope.data = data1;
});

// Dataset Controller
app.controller('DatasetCtrl', function($scope, $routeParams, Restangular) {

  $scope.updateTerm = function(i) {
	  var panel = $scope.panels[i];
    panel.sectionId = null;
    panel.assessmentTypeId = null;
    panel.assessmentId = null;
    panel.criterionId = null;
    panel.assessmentTypes = [];
    panel.assessments = [];
    panel.criterion = [];

	  Restangular.one('terms', panel.termId).getList('sections').then(function(sections) {
      panel.sections = sections;
    });
  };

  $scope.updateSection = function(i) {
    var panel = $scope.panels[i];

  	if (panel.sectionId !== undefined) {
  	  Restangular.one('sections', panel.sectionId).getList('assessment_types').then(function(assessmenttypes) {
        panel.assessmentTypes = assessmenttypes;
      });
  	}

    panel.assessmentTypeId = null;
    panel.assessmentId = null;
    panel.criterionId = null;
	  panel.assessmentTypes = [];
	  panel.assessments = [];
	  panel.criterion = [];
  };

  $scope.updateStatistic = function(i) {

  };

  $scope.updateAssessmentType = function(i) {
  	var panel = $scope.panels[i];

  	if (panel.assessmentTypeId !== undefined) {
  	  Restangular.one('assessment_types', panel.assessmentTypeId).getList('assessments').then(function(assessments) {
	      panel.assessments = assessments;
	      console.log(panel.assessments);
	    });
  	}

    panel.assessmentId = null;
    panel.criterionId = null;
    panel.assessments = [];
    panel.criterion = [];
  };

  $scope.updateAssessment = function(i) {
    var panel = $scope.panels[i];

  	if (panel.assessmentId !== undefined) {
  	  Restangular.one('assessments', panel.assessmentId).getList('criterions').then(function(criterions) {
	      panel.criterions = criterions;
	    });
  	}

    panel.criterionId = null;
    panel.criterion = [];
  };

  $scope.updateCriterion = function(i) {
  };

  $scope.save = function(i) {
  	// create new dataset if we're saving the last dataset
  	if (i == $scope.panels.valueOf().length - 1) {
  	  var newPanel = angular.copy($scope.defaultPanel);
  	  newPanel.id = $scope.panels.valueOf().length + 1;
	  	$scope.panels.push(newPanel);
  	}
  };
});

