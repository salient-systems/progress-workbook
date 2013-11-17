// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {

  $scope.defaultPanel = {
    id: 1,
    open: true,
    searchCriteria: "",
    termId: null,
    classId: null,
    assessmentTypeId: null,
    assessmentId: null,
    criterionId:  null,
    statistic: null,
    sections: [],
	  assessmentTypes: [],
	  assessments: [],
	  criterions: []
  };

  $scope.panels = [$scope.defaultPanel];

  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
    $scope.defaultPanel.termId = $scope.terms.length;
    Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
      $scope.panels[0].sections = sections;
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
    },
    {
      data: punkPoints,
      color: '#3a4452',
      bars: {show: true, barWidth:1, fillColor: '#3a4452', order: 2, align: "center" }
    }];

  $scope.data = data1;

});

// Dataset Controller
app.controller('DatasetCtrl', function($scope, $routeParams, Restangular) {
  $scope.updateTerm = function(i) {
	  Restangular.one('terms', $scope.panels[i].termId).getList('sections').then(function(sections) {
      $scope.panels[i].sections = sections;
    });
  };

  $scope.updateSection = function(i) {
    var panel = $scope.panels[i];

  	if (panel.classId !== undefined) {
  	  Restangular.one('sections', panel.classId).getList('assessment_types').then(function(assessmenttypes) {
        panel.assessmentTypes = assessmenttypes;
      });
  	} else {
      panel.assessmentTypeId = null;
      panel.assessmentId = null;
      panel.criterionId = null;
  	  panel.assessmentTypes = [];
  	  panel.assessments = [];
  	  panel.criterion = [];
  	}
  };

  $scope.updateStatistic = function(i) {

  };

  $scope.updateAssessmentType = function(i) {
  	console.log($scope.panels[i].assessmentTypeId);
  	if ($scope.panels[i].assessmentTypeId !== undefined) {
  	  Restangular.one('assessment_types', $scope.panels[i].assessmentTypeId).getList('assessments').then(function(assessments) {
	      $scope.panels[i].assessments = assessments;
	    });
  	}
  };

  $scope.updateAssessment = function(i) {
  	if ($scope.panels[i].assessmentId !== undefined) {
  	  Restangular.one('assessments', $scope.panels[i].assessmentId).getList('criterions').then(function(criterions) {
	      $scope.panels[i].criterions = criterions;
	    });
  	}
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

