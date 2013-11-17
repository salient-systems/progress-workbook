// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {

  $scope.defaultPanel = {
    id: 1,
    open: true,
    searchCriteria: "",
    assessmentName: "",
    criterion:  "",
    termId: "",
    classId: "",
    statistic: "",
    assessmentTypeName: "",
    sections: [],
	  assessment_types: [],
	  assessments: [],
	  criterions: []
  };

  $scope.panels = [$scope.defaultPanel];

  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
    $scope.defaultPanel.termId = $scope.terms.length;
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
  	if($scope.panels[i].termId != "") {
  	  Restangular.one('terms', $scope.panels[i].termId).getList('sections').then(function(sections) {
        $scope.panels[i].sections = sections;
      });
  	}
  };

  $scope.updateSection = function(i) {
  	if ($scope.panels[i].classId != "") {
  	  Restangular.one('sections', $scope.panels[i].classId).getList('assessment_types').then(function(assessmenttypes) {
        $scope.panels[i].assessment_types = assessmenttypes;
      });
  	}
  };

  $scope.updateStatistic = function(i) {

  };

  $scope.updateAssessmentType = function(i) {
  	console.log($scope.panels[i].assessmentTypeName);
  	if ($scope.panels[i].assessmentTypeName != "") {
  	  Restangular.one('assessment_types', $scope.panels[i].assessmentTypeName).getList('assessments').then(function(assessments) {
	      $scope.panels[i].assessments = assessments;
	    });
  	}
  };

  $scope.updateAssessment = function(i) {
  	if ($scope.panels[i].assessmentName != "") {
  	  Restangular.one('assessments', $scope.panels[i].assessmentName).getList('criterions').then(function(criterions) {
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

