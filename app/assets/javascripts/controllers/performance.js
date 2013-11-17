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
      $scope.setupTypeahead();
    });
  });

  $scope.setupTypeahead = function() {
    // add student typeahead
    $('input#search').typeahead([{
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

    $('input#search').bind('typeahead:selected', function(obj, datum, name) {
      console.log('lol');
    });
  };
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
    $scope.statistics = $scope.sectionStatistics;

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

	    $scope.statistics = $scope.assessmentTypeStatistics;
  	}
  	else {
      $scope.statistics = $scope.sectionStatistics;
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

	    $scope.statistics = $scope.assessmentStatistics;
  	}
  	else {
	    $scope.statistics = $scope.assessmentTypeStatistics;
  	}

    panel.criterionId = null;
    panel.criterion = [];
  };

  $scope.updateCriterion = function(i) {
    var panel = $scope.panels[i];

    if (panel.criterionId !== undefined) {
      $scope.statistics = $scope.criterionStatistics;
    }
    else {
      $scope.statistics = $scope.assessmentStatistics;
    }
  };

  $scope.sectionStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" }
  ];

  $scope.assessmentTypeStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 5, name: "Percent of Term" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
    { id: 8, name: "Students Present" },
    { id: 9, name: "Students Enrolled" }
  ];

  $scope.assessmentStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
    { id: 8, name: "Students Present" },
    { id: 9, name: "Students Enrolled" }
  ];

  $scope.criterionStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
  ];

  $scope.statistics = $scope.sectionStatistic;

  $scope.save = function(i) {
  	// create new dataset if we're saving the last dataset
  	if (i == $scope.panels.valueOf().length - 1) {
  	  var newPanel = angular.copy($scope.defaultPanel);
  	  newPanel.id = $scope.panels.valueOf().length + 1;
	  	$scope.panels.push(newPanel);
  	}
  };
});

