//Assessment Details Page(s)
app.controller('AssessmentCtrl', function($scope, $routeParams, Restangular) {

  var assessment_type = Restangular.one('assessment_types', $routeParams.assessment_type_id);
  var section = Restangular.one('sections', $routeParams.section_id);

  $scope.view1 = false;
  $scope.view1 = false;
  $scope.view1 = false;

  if($routeParams.view_id == 1){
  	$scope.view1 = true;
  }

  if($routeParams.view_id == 2){
  	$scope.view2 = true;
  }

  if($routeParams.view_id == 3){
  	$scope.view3 = true;
  }

  $scope.assessment_type = assessment_type.get();

  section.get().then(function(thesection) {
    $scope.section = thesection;
  });


/*
  var myHeaderCellTemplate =   '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
                               '<div style="word-wrap: break-word;" ng-click="col.sort($event)" ng-class="colt + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
                               '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
                               '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
                               '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
                               '</div>'+
                               '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

  var editTemplate2 = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="saveGrade(col.index)" />';
  var editTemplate = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="saveGrade(col.index)" ng-focus="backupGrade(col.index)" />';
  var headerrow = '<div style="writing-mode: tb-rl">Hello</div>';
  var vcellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(\'fname\')}} {{row.getProperty(\'lname\')}}</a></div>';
*/
assessment_type.getList('assessments').then(function(thereturn){
  $scope.assessments = thereturn;

  Restangular.all('criterions').getList({assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
    $scope.criterions = thereturn;

	$scope.modalCriterions = Restangular.copy(thereturn);
	$scope.newCriterions = [];


	$scope.numOfCrit = [];
	$scope.numOfCrit[0] = 1;
	$scope.startOfCrit = [];
	$scope.startOfCrit[0] = 0;
	$scope.showAssessment = [];
	$scope.showAssessment[0] = true;
	var currentassessment = thereturn[0].assessment_id;
	var z = 0;
	for(var i = 1; i < thereturn.length; i++){
		if(thereturn[i].assessment_id == currentassessment){
			$scope.numOfCrit[z] = $scope.numOfCrit[z] + 1;
			$scope.showAssessment[i] = false;
		}else{
			z = z + 1;
			currentassessment = thereturn[i].assessment_id;
			$scope.showAssessment[i] = true;
			$scope.startOfCrit[z] = i;
			$scope.numOfCrit[z] = 1;
		}
	}

	$scope.sizeAssessment = [];
	z = 0;
	for(var i = 0; i < $scope.numOfCrit.length; i++){
		for(var y = 0; y < $scope.numOfCrit[i]; y++){
			$scope.sizeAssessment[z] = $scope.numOfCrit[i];
			z = z + 1;
		}
	}

	$scope.indexAssessment = [];
	$scope.indexAssessment[0] = 0;
	z = 0;
	for(var i = 1; i < thereturn.length; i++){
		if($scope.showAssessment[i] == true){
			z = z + 1;
		}
		$scope.indexAssessment[i] = z;
	}


	Restangular.all('studentassessments').getList({section_id: $routeParams.section_id, assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
	   $scope.students = thereturn;

	   //Calculating Criterion Totals
       $scope.criterions.present = [];
       $scope.criterions.total = [];
       $scope.criterions.percent = [];

       for(var j = 0; j < $scope.criterions.length; j++){
         $scope.criterions.present[j] = 0;
         $scope.criterions.total[j] = 0;
         for(var i = 0; i < thereturn.length; i++){
        	if (thereturn[i].scores[j].score != null){
      	      $scope.criterions.present[j] = $scope.criterions.present[j] + 1;
              $scope.criterions.total[j] = $scope.criterions.total[j] + thereturn[i].scores[j].score;
      	    }
         }
       }

       for(var i = 0; i < $scope.criterions.length; i++){
    	 $scope.criterions.percent[i] = Math.floor($scope.criterions.total[i] / $scope.criterions.present[i] / $scope.criterions[i].max * 100);
       }


       //Calculating Student Totals
       for(var i = 0; i < thereturn.length ; i++){
       	$scope.students[i].total = 0;
       	$scope.students[i].max = 0;
       	 for(var j = 0; j < $scope.criterions.length; j++){
       	 	$scope.students[i].total = $scope.students[i].total + thereturn[i].scores[j].score;
       	 	$scope.students[i].max = $scope.students[i].max + $scope.criterions[j].max;
       	 }
       }

       for(var i = 0; i < thereturn.length; i++){
    	 $scope.students[i].percent = Math.floor($scope.students[i].total / $scope.students[i].max * 100);
       }

       //Calculating Assessment Totals
       var counter = 0;
       for(var j = 0; j < $scope.assessments.length; j++){
         $scope.assessments[j].present = 0;
         $scope.assessments[j].total = 0;
         $scope.assessments[j].max = 0;
         for(var k = 0; k < $scope.numOfCrit[j]; k++){
      	   $scope.assessments[j].total = $scope.assessments[j].total + $scope.criterions.total[counter];
      	   $scope.assessments[j].max = $scope.assessments[j].max + $scope.criterions[counter].max;
      	   if($scope.assessments[j].present < $scope.criterions.present[counter]){
      	     $scope.assessments[j].present = $scope.criterions.present[counter];
      	   }
      	   counter++;
         }
       }

       for(var i = 0; i < $scope.assessments.length; i++){
    	 $scope.assessments[i].percent = Math.floor($scope.assessments[i].total / $scope.assessments[i].present / $scope.assessments[i].max * 100);
       }


       //Calculating student score per assessment
       counter = 0;
       for(var i = 0; i < thereturn.length; i++){
       	 $scope.students[i].assessmentTotal = [];
         $scope.students[i].assessmentMax = [];
         $scope.students[i].assessmentPercent = [];
       }
       for(var i = 0; i < thereturn.length; i++){
       	 counter = 0;
         for(var k = 0; k < $scope.assessments.length; k++){
           $scope.students[i].assessmentTotal[k] = 0;
           $scope.students[i].assessmentMax[k] = 0;
           for(var j = 0; j < $scope.numOfCrit[k]; j++){
             $scope.students[i].assessmentTotal[k] += thereturn[i].scores[counter].score;
             $scope.students[i].assessmentMax[k] += $scope.criterions[counter].max;
             counter++;
           }
           $scope.students[i].assessmentPercent[k] = Math.floor($scope.students[i].assessmentTotal[k] / $scope.students[i].assessmentMax[k] * 100);
         }
       }


       //calculating Criterions average score.
       for(var i = 0; i < $scope.criterions.length; i++){
      	 $scope.criterions[i].studentTotal = 0;
     	 $scope.criterions[i].studentPresent = 0;
     	 for(var j = 0; j < $scope.students.length; j++){
           $scope.criterions[i].studentTotal = $scope.criterions[i].studentTotal + $scope.students[j].scores[i].score;
           if ($scope.students[j].scores[i].score != null){
          	 $scope.criterions[i].studentPresent = $scope.criterions[i].studentPresent + 1;
           }
     	 }
     	 var average = $scope.criterions[i].studentTotal / $scope.criterions[i].studentPresent;
     	 $scope.criterions[i].studentAverage = average.toFixed(1);
     	 $scope.criterions[i].studentPercent = Math.floor($scope.criterions[i].studentTotal / $scope.criterions[i].studentPresent / $scope.criterions[i].max * 100);
       }

/*
       $scope.myDefs2 = [];
       var myobj = {};
       myobj.field = 'fname';
       myobj.displayName = 'Name';
       myobj.cellTemplate = vcellTemplate;
       myobj.enableCellEdit = false;
       myobj.resizable = true;
       myobj.width = '15%';

       $scope.myDefs2[0] = myobj;


	  for(var i = 0; i < $scope.criterions.length; i++){

	    var myobj2 = {};
	    myobj2.field = "scores["+i+"].score";
        myobj2.displayName = $scope.criterions[i].name;
        myobj2.editableCellTemplate = editTemplate;
        myobj2.enableCellEdit = true;
        myobj2.resizable = true;
        myobj2.headerCellTemplate = myHeaderCellTemplate;
        myobj2.width = '35px';
        $scope.myDefs2[i+1] = myobj2;
	  }
*/
	});
  });
});

  $scope.percentColor = function(a){
    if (a == 0){
      return "rgba(176,176,176,1)";
    }else if (a < 75){
    	return "rgba(214,77,73,1)";
    }else if (a < 85){
    	return "rgba(238,161,52,1)";
    }else {
    	return "rgba(78,169,78,1)";
    }
  };

  $scope.range = function(n) {
    return new Array(n);
  };

  $scope.tofloor = function(n){
    var thereturn = Math.floor(n);
    return thereturn;
  };

  $scope.domod = function(a,b){
  	var thereturn = a % b;
  	return thereturn;
  };

  $scope.domulti = function(a,b){
  	var thereturn = a * b;
  	return thereturn;
  };

  $scope.save = function() {
    $scope.assessment.name = $scope.editAssessment.name;
    $scope.assessment.subject = $scope.editAssessment.subject;
    $scope.assessment.data_type = $scope.editAssessment.data_type;
    $scope.assessment.put();
    $('#editAssessmentModal').modal('hide');
  };

  $scope.setupEditAssessment = function() {
    $scope.editAssessment = {
      name: $scope.assessment.name,
      subject: $scope.assessment.subject,
      data_type: $scope.assessment.data_type
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditAssessment();
    $scope.validateName = false;
    $scope.validateSubject = false;
    $scope.validateData_Type = false;
  };

  $scope.saveGrade = function(criterion) {
  	if ($scope.oldValue != criterion.score){
  	  if(criterion.score.length == 0){
  	  	criterion.score = null;
  	  }else{
  	  	criterion.score = Number(criterion.score);
  	  }
  	  var editable = Restangular.copy(criterion);
  	  editable.route = "criterion_grades";
  	  editable.put();
  	  recalc();
  	}
  };

  $scope.backupGrade = function(index) {
  	$scope.gradeBackup = this.row.entity.scores[index-1].score;
  };

  $scope.currentAssessment = 0;

  $scope.assessmentIndex = function(index) {
  	//console.log(index);
  	if($scope.startOfCrit[$scope.currentAssessment] == index){
  		$scope.currentAssessment = $scope.currentAssessment + 1;
  	}
  	//console.log($scope.currentAssessment);
  	return $scope.currentAssessment;
  };

  $scope.assessmentShow = function(index) {
  	if($scope.startOfCrit[$scope.currentAssessment] == index){
  		return "true";
  	}
  	else{
  		return "false";
  	}
  };

  var recalc = function(){
    //This Section is for calculating the criterion totals
  	for(var j = 0; j < $scope.criterions.length; j++){
        $scope.criterions.present[j] = 0;
        $scope.criterions.total[j] = 0;
        for(var i = 0; i < $scope.students.length; i++){
        	if ($scope.students[i].scores[j].score != null){
      	      $scope.criterions.present[j] = $scope.criterions.present[j] + 1;
      	      if($scope.students[i].scores[j].score != 0){
      	        $scope.criterions.total[j] = $scope.criterions.total[j] + $scope.students[i].scores[j].score;
      	      }

      	    }
        }
    }

    for(var i = 0; i < $scope.criterions.length; i++){
      $scope.criterions.percent[i] = 0;
      $scope.criterions.percent[i] = Math.floor($scope.criterions.total[i] / $scope.criterions.present[i] / $scope.criterions[i].max * 100);
    }

    //This section is for calculating the Students totals
    for(var i = 0; i < $scope.students.length ; i++){
      $scope.students[i].total = 0;
      $scope.students[i].max = 0;
      for(var j = 0; j < $scope.criterions.length; j++){
        $scope.students[i].total = $scope.students[i].total + $scope.students[i].scores[j].score;
       	$scope.students[i].max = $scope.students[i].max + $scope.criterions[j].max;
      }
    }

    for(var i = 0; i < $scope.students.length; i++){
      $scope.students[i].percent = Math.floor($scope.students[i].total / $scope.students[i].max * 100);
    }

    //This section is for calculating the Assessment totals
    var counter = 0;
    for(var j = 0; j < $scope.assessments.length; j++){
      $scope.assessments[j].present = 0;
      $scope.assessments[j].total = 0;
      $scope.assessments[j].max = 0;
      for(var k = 0; k < $scope.numOfCrit[j]; k++){
        $scope.assessments[j].total = $scope.assessments[j].total + $scope.criterions.total[counter];
        $scope.assessments[j].max = $scope.assessments[j].max + $scope.criterions[counter].max;
          if($scope.assessments[j].present < $scope.criterions.present[counter]){
      	    $scope.assessments[j].present = $scope.criterions.present[counter];
      	  }
      	  counter++;
       }
     }

     for(var i = 0; i < $scope.assessments.length; i++){
       $scope.assessments[i].percent = Math.floor($scope.assessments[i].total / $scope.assessments[i].present / $scope.assessments[i].max * 100);
     }


     //Calculates Student scores per criterion.
     for(var i = 0; i < $scope.criterions.length; i++){
      	 $scope.criterions[i].studentTotal = 0;
     	 $scope.criterions[i].studentPresent = 0;
     	 for(var j = 0; j < $scope.students.length; j++){
           $scope.criterions[i].studentTotal = $scope.criterions[i].studentTotal + $scope.students[j].scores[i].score;
           if ($scope.students[j].scores[i].score != null){
          	 $scope.criterions[i].studentPresent = $scope.criterions[i].studentPresent + 1;
           }
     	 }
     	 var average = $scope.criterions[i].studentTotal / $scope.criterions[i].studentPresent;
     	 $scope.criterions[i].studentAverage = average.toFixed(1);
     	 $scope.criterions[i].studentPercent = Math.floor($scope.criterions[i].studentTotal / $scope.criterions[i].studentPresent / $scope.criterions[i].max * 100);
       }

     //Calculating student score per assessment
     counter = 0;
     for(var i = 0; i < $scope.students.length; i++){
       counter = 0;
       for(var k = 0; k < $scope.assessments.length; k++){
         $scope.students[i].assessmentTotal[k] = 0;
         $scope.students[i].assessmentMax[k] = 0;
         for(var j = 0; j < $scope.numOfCrit[k]; j++){
           $scope.students[i].assessmentTotal[k] += $scope.students[i].scores[counter].score;
           $scope.students[i].assessmentMax[k] += $scope.criterions[counter].max;
           counter++;
         }
         $scope.students[i].assessmentPercent[k] = Math.floor($scope.students[i].assessmentTotal[k] / $scope.students[i].assessmentMax[k] * 100);
       }
     }

  };

  $scope.checkVal = function(criterion) {
  	//console.log(criterion);
  	$scope.oldValue = criterion.score;
  };

  $scope.nochange = function(criterion){
  	criterion.score = $scope.oldValue;
  };

  $scope.getCritStart = function(indexx){
  	var thereturn = 0;
  	if(indexx > 0){
  		for(var i = 0; i < indexx; i++){
  			thereturn += $scope.numOfCrit[i];
  		}
  	}
  	return thereturn;
  };
/*
  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: false,
    selectWithCheckboxOnly: true,
    enableCellSelection: true,
    enableCellEditOnFocus: true,
    enableRowSelection: false,
    enableCellEdit: true,
    //headerRowHeight: 200,
    sortInfo: {fields:['fname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: 'myDefs2' ,

    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      //saveGrade(col.index);
      console.log(col.index);
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };
*/
});

//controller for the modal that edits the assessment info for an assessment type
app.controller('EditRunChartCtrl', function($scope, $routeParams, Restangular){

  $scope.changedOldCritFlags = [];

  $scope.setupEditCriterion = function() {
    $scope.editCriterion = {
      name: $scope.user.fname,
      max: $scope.user.lname,
    };
    $scope.updateRole();
  };

  $scope.newCriterion = function() {
    var newCrit = {
      max: $scope.modalCriterions[$scope.modalCriterions.length-1].max, //gives new criterions the value for max the same as the last criterion in the assessment
      name: ($scope.modalCriterions.length + 1),
      assessment_id: $scope.assessments[0].id
    };
    $scope.newCriterionIndex++;
    $scope.modalCriterions.push(newCrit);
    $scope.newCriterions.push(newCrit);
  };

  $scope.save = function() {
    $scope.newCriterions.forEach(function(crit){
      $scope.criterions.push(crit);
      var editable = Restangular.copy(crit);
      editable.route = "criterions";
      editable.post();
    });
    $scope.newCriterions = [];
    for(var i = 0; i < $scope.changedOldCritFlags.length; i++){
      $scope.criterions[$scope.changedOldCritFlags[i]] = $scope.modalCriterions[$scope.changedOldCritFlags[i]]; 
      $scope.criterions[$scope.changedOldCritFlags[i]].put();
    }
    location.reload();
  };

  $scope.cancel = function() {
    $scope.newCriterions.forEach(function(crit){
      var indexToRemoveModal = $scope.modalCriterions.indexOf(crit);
      $scope.modalCriterions.splice(indexToRemoveModal, 1);
    });
    $scope.newCriterions = [];
    
    for(var i = 0; i < $scope.changedOldCritFlags.length; i++){
      var index = $scope.changedOldCritFlags[i];
      $scope.modalCriterions[index].name = $scope.criterions[index].name;
    }
  };

  $scope.remove = function(criterion) {
    var indexToRemoveModal = $scope.modalCriterions.indexOf(criterion);
    $scope.modalCriterions.splice(indexToRemoveModal, 1);
    var indexToRemove = $scope.criterions.indexOf(criterion);
    if(indexToRemove >= 0)
    {
      $scope.criterions.splice(indexToRemove, 1);
    }
    var indexToRemoveNew = $scope.newCriterions.indexOf(criterion);
    if(indexToRemoveNew >= 0){
      $scope.newCriterions.splice(indexToRemoveNew, 1);
    }
    else
    {
      var editable = Restangular.copy(criterion);
      editable.route = "criterions";
      editable.remove();
    }
  };
  
  $scope.changedOldCriterion = function(criterion, index){
    if($scope.newCriterions.indexOf(criterion) < 0){
      $scope.changedOldCritFlags.push(index);
      console.log("your index was: " + index);
    }
  };

});