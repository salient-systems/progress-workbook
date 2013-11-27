/*
 * Master Performance Controller
 *
 */
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular, $http, $timeout) {

  $scope.panelIndex = 0;
  $scope.noDelete = true;

  $scope.defaultPanel = {
    id: 0,
    open: true,
    filterType: "",
    filterDatum: null,
    termId: null,
    sectionId: null,
    assessmentTypeId: null,
    assessmentId: null,
    criterionId:  null,
    statistic: null,
    sections: [],
	  assessmentTypes: [],
	  assessments: [],
	  criterions: [],
	  setupSearch: function() {
	    var self = this;
	    var search = $('input#search' + self.id);

      search.typeahead([{
        name: 'students',
        limit: 3,
        header: '<h5><img src="/assets/gradcap.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Students<strong></h5>',
        local: $scope.searchDatums.students,
      }, {
        name: 'cohorts',
        limit: 3,
        header: '<h5><img src="/assets/group.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Cohorts<strong></h5>',
        local: $scope.searchDatums.cohorts
      }, {
        name: 'users',
        limit: 3,
        header: '<h5><img src="/assets/apple.png" style="margin-left: 10px; margin-right: 3px;"> <strong>Users<strong></h5>',
        local: $scope.searchDatums.users
      }]);

      $('.tt-query').css('background-color','#fff');

      // if duplicating, set the value of the search bar
      if (self.filterDatum != null) {
        search.val(self.filterDatum.value);
      }

      //
      search.bind('typeahead:selected', function(event, datum, name) {
        self.filterType = name; // search type is user, student, or cohort
        self.filterDatum = datum; // the id of the user, student, or cohort
        $scope.updateTerm(self);
      });
    }
  };

  // insert the default first panel
  $scope.panels = [angular.copy($scope.defaultPanel)];

  // prefetch the latest term and and it's classes
  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
    $scope.panels[0].termId = $scope.terms.length;
    $scope.defaultPanel.termId = $scope.terms.length;

    Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
      $scope.panels[0].sections = sections;
      $scope.defaultPanel.sections = sections;
    });
  });

  // fetch the twitter typeahead datums
  $http.get('/performance/search.json').success(function(datums) {
    $scope.searchDatums = datums;
    // now we have datums, so setup the typeahead for the default panel
    angular.bind($scope.panels[0], $scope.panels[0].setupSearch)();
  });

  /*
   * Dataset filter functions
   *
   */
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

  $scope.save = function(isLast) {
    // TODO get the performance data!

    // create new dataset if we're saving the last dataset
    if (isLast) {
      $scope.createPanel($scope.defaultPanel);
    }
  };

  $scope.duplicate = function(panelIndex) {
    $scope.createPanel($scope.panels[panelIndex]);
  };

  $scope.createPanel = function(panel) {
    var newPanel = angular.copy(panel);
    newPanel.id = ++$scope.panelIndex;
    $scope.panels.push(newPanel);
    $timeout(function() { angular.bind(newPanel, newPanel.setupSearch)(); }, 0);
    $scope.noDelete = false;
    $scope.scrollToBottom();
  };

  $scope.remove = function(i) {
    $scope.panels.splice(i, 1);
    if($scope.panels.valueOf().length == 1) {
      $scope.noDelete = true;
    }
  };

  $scope.updateTerm = function(panel) {
	  //var panel = $scope.panels[i];
    panel.sectionId = null;
    panel.assessmentTypeId = null;
    panel.assessmentId = null;
    panel.criterionId = null;
    panel.assessmentTypes = [];
    panel.assessments = [];
    panel.criterion = [];

    if (panel.filterDatum != null) {
      var userOrStudent = Restangular.one(panel.filterType, panel.filterDatum.id);
      userOrStudent.all('sections').getList({term_id: panel.termId}).then(function(sections) {
          panel.sections = sections;
      });
    } else {
  	  Restangular.one('terms', panel.termId).getList('sections').then(function(sections) {
        panel.sections = sections;
      });
    }
  };

  $scope.updateSection = function(i) {
    var panel = $scope.panels[i];

  	if (panel.sectionId !== undefined) {
  	  Restangular.one('sections', panel.sectionId).getList('assessment_types').then(function(assessmenttypes) {
        panel.assessmentTypes = assessmenttypes;
      });
  	}

    $scope.statistics = $scope.sectionStatistics;
  	panel.statistic = null;
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
  	} else {
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
  	} else {
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
    } else {
      panel.statistic = null;
      $scope.statistics = $scope.assessmentStatistics;
    }
  };

  $scope.scrollToBottom = function() {
    $('html, body').animate({scrollTop:$(document).height()}, 1500);
  };
});

/*
 * Chart Controller
 *
 */
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