// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {
  Restangular.all('terms').getList().then(function(theterm) {
    $scope.terms = theterm;
  });
  Restangular.all('sections').getList().then(function(thesection) {
    $scope.sections = thesection;
  });
  Restangular.all('assessment_types').getList().then(function(theassessmenttype) {
    $scope.assessment_types = theassessmenttype;
  });
  Restangular.all('assessments').getList().then(function(theassessment) {
    $scope.assessments = theassessment;
  });
  Restangular.all('criterions').getList().then(function(thecriterion) {
    $scope.criterions = thecriterion;
  });

  $scope.defaultPanel = {
    id: 1,
    open: true,
    searchCriteria: "",
    termID: null,
    classId: null,
    assessmentTypeName: null,
    assessmentId: null,
    criterion: null,
    statistic: null,
  };

  $scope.panels = [$scope.defaultPanel];
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
  	if($scope.panels[i].termID != "") {
  	  Restangular.one('terms', $scope.panels[i].termID).getList('sections').then(function(sections) {
        $scope.sections[i] = sections;
      });
  	}
  };

  $scope.updateSection = function(i) {
  	if ($scope.panels[i].classId != "") {
  	  Restangular.one('sections', $scope.panels[i].classId).getList('assessment_types').then(function(assessmenttypes) {
        $scope.assessment_types[i] = assessmenttypes;
      });
  	}
  };

  $scope.updateStatistic = function(i) {

  };

  $scope.updateAssessmentType = function(i) {
  	console.log($scope.panels[i].assessmentTypeName);
  	if ($scope.panels[i].assessmentTypeName != "") {
  	  Restangular.one('assessment_types', $scope.panels[i].assessmentTypeName).getList('assessments').then(function(assessments) {
	      $scope.assessments[i] = assessments;
	    });
  	}
  };

  $scope.updateAssessment = function(i) {
  	if ($scope.panels[i].assessmentName != "") {
  	  Restangular.one('assessments', $scope.panels[i].assessmentName).getList('criterions').then(function(criterions) {
	      $scope.criterions[i] = criterions;
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

