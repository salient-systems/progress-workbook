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
  //$('#inClass').css('visibility', 'hidden');

  $scope.panels = [
    {
      dataSetName: 'Data Set 1',
      id: 1,
      open: true,
      searchCriteria: "",
      assessmentName: "",
      criterion:  "",
      termID: "",
      classId: "",
      statistic: "",
      assessmentTypeName: ""
    }
  ];

  //chart controller
  app.controller('ChartController', function($scope){
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

  app.controller('accordionCtrl', function($scope, $routeParams, Restangular) {
    $scope.updateTerm = function(index){
    	if($scope.panels[index].termID != null) {
    	  console.log("Inside updateTerm");
    	  Restangular.one('terms', $scope.panels[index].termID).getList('sections').then(function(sections) {
  	    $scope.sections[index] = sections;
  	  });
    	}
    };

    $scope.updateSection = function(index) {
    	if($scope.panels[index].classId != null){
    	  console.log("Inside updateSection");
    	  Restangular.one('sections', $scope.panels[index].classId).getList('assessment_types').then(function(assessmenttypes) {
  	    $scope.assessment_types[index] = assessmenttypes;
  	  });
    	}
    };

    $scope.updateStatistic = function(index) {
    };

    $scope.updateAssessmentType = function(index) {
    	if($scope.panels[index].assessmentTypeName != null){
    	  console.log("Inside updateAssessmentType");
    	  Restangular.one('assessment_types', $scope.panels[index].assessmentTypeName).getList('assessments').then(function(assessments) {
  	    $scope.assessments[index] = assessments;
  	  });
    	}
    };

    $scope.updateAssessment = function(index) {
    	if($scope.panels[index].assessmentName != null){
    	  console.log("Inside updateAssessment");
    	  Restangular.one('assessments', $scope.panels[index].assessmentName).getList('criterions').then(function(criterions) {
  	    $scope.criterions[index] = criterions;
  	  });
    	}
    };

    $scope.updateCriterion = function(index) {
    };

    //this function will add a new data field when the save button is clicked
    $scope.save = function(index) {
    	console.log($scope.panels.valueOf().length);
    	console.log(index);
    	console.log($scope.panels[index]);
    	console.log($scope.dataSetForm);
    	//check if last panel clicking save is to open a
    	if (index == $scope.panels.valueOf().length - 1) {
  	  	$scope.panels.push({
  	    	dataSetName: "noob",
  	    	id: $scope.panels.valueOf().length + 1,
  	    	open: true,
  	    	searchCriteria: "",
	        term: "",
	        classId: "",
	        statistic: "",
	        assessmentTypeName: "",
	        assessmentName: "",
	        criterion: ""
	    	});
    	}
    };
  });
});
