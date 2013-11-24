// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {

  $scope.defaultPanel = {
    id: 1,
    open: true,
    filterType: "",
    filterId: null,
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

  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
    //$scope.panels[0].termId = $scope.terms.length;
    $scope.defaultPanel.termId = $scope.terms.length;
    Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
      //$scope.panels[0].sections = sections;
      $scope.defaultPanel.sections = sections;
      $scope.setupTypeahead();
    });
  });

  $scope.panels = [angular.copy($scope.defaultPanel)];
  $scope.noDelete = true;

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
    $('input.search').typeahead([{
      name: 'students',
      limit: 3,
      header: '<h5><img src="/assets/gradcap.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Students<strong></h5>',
      prefetch: {
        url: '/students/search.json',
        ttl: 0
      },
    }, {
      name: 'cohorts',
      limit: 3,
      header: '<h5><img src="/assets/group.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Cohorts<strong></h5>',
      prefetch: {
        url: '/cohorts/search.json',
        ttl: 0
      }
    }, {
      name: 'users',
      limit: 3,
      header: '<h5><img src="/assets/apple.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Users<strong></h5>',
      prefetch: {
        url: '/users/search.json',
        ttl: 0
      }
    }]);

    $('.tt-query').css('background-color','#fff');

    $('input.search').live('typeahead:selected', function(event, datum, name) {
      console.log(event);
      console.log(datum);
      console.log(name);
      console.log($(event.currentTarget).attr('id'));

      var panel = $scope.panels[$(event.currentTarget).attr('id')];
      panel.filterType = name; // search type is user, student, or cohort
      panel.filterId = datum.id;
    });
  };
});

// Chart Controller
app.controller('ChartCtrl', function($scope){
  //color : #F26C4F, #FBAF5C, #FFF467, #00BFF3, #3BB878, #438CCA, #A763A8, #F06EA9, #998675, #754C24
  var daftPoints = [[0, 4]], punkPoints = [[1, 14]];
  //color : #F26C4F, #FBAF5C, #FFF467, #00BFF3, #3BB878, #438CCA, #A763A8, #F06EA9, #998675, #754C24
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
  //$scope.data = data1;

  var options = {
      /*xaxis: {
        ticks:[[0,'Daft'],[1,'Punk']]
      },*/
    grid: {
      labelMargin: 10,
      backgroundColor: '#e2e6e9',
      color: '#ffffff',
      borderColor: null
    }
  };

  $.plot($("#perfGraph"), data1, options);
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
  	panel.statistic = null;
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

      panel.statistic = null;
	    $scope.statistics = $scope.assessmentTypeStatistics;
  	}
  	else {
  	  panel.statistic = null;
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

      panel.statistic = null;
	    $scope.statistics = $scope.assessmentStatistics;
  	}
  	else {
  	  panel.statistic = null;
	    $scope.statistics = $scope.assessmentTypeStatistics;
  	}

    panel.criterionId = null;
    panel.criterion = [];
  };

  $scope.updateCriterion = function(i) {
    var panel = $scope.panels[i];

    if (panel.criterionId !== undefined) {
      panel.statistic = null;
      $scope.statistics = $scope.criterionStatistics;
    }
    else {
      panel.statistic = null;
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
	  	$scope.noDelete = false;
  	}
  };

  $scope.duplicate = function(i) {
    // create new dataset if we're saving the last dataset
    var newPanel = angular.copy($scope.panels[i]);
    newPanel.id = $scope.panels.valueOf().length + 1;
    $scope.panels.push(newPanel);
    $scope.noDelete = false;
  };


  $scope.remove = function(i) {
    // create new dataset if we're saving the last dataset
    $scope.panels.splice(i, 1);
    if($scope.panels.valueOf().length == 1) {
      $scope.noDelete = true;
    }
  };
});

