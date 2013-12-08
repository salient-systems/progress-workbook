//Assessment Details Page(s)
app.controller('AssessmentCtrl', function($scope, $routeParams, Restangular) {
  $('div#backButton').hide();
  var assessment_type = Restangular.one('assessment_types', $routeParams.assessment_type_id);
  var section = Restangular.one('sections', $routeParams.section_id);


    $('div.assessment-view').on('keydown', 'input.inputbox', function(ev) {
     if(ev.which === 13) {
        ev.preventDefault();
        var cell = $(ev.currentTarget).parent();
        var index = cell.index();
        cell.parent().next().children().eq(index).find("input").focus();
      }else if ( $.inArray(event.keyCode,[46,8,9,27,13,190]) !== -1 ||
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
       }else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
  });





  assessment_type.get().then(function(thereturn){
    $scope.assessment_type = thereturn;
    $scope.assessment_type_name = thereturn.name;
  });

  section.get().then(function(thesection) {
    $scope.section = thesection;
  });


  $scope.plotit = function(index){
   var idnum = '#student'+index;
   var idnumpop = '#studentplot'+index;
   var studentArr = $scope.createStudentData(index);
   var legendcontainer = '#legend'+index;
   var options = {
    series: {
        lines: { show: true },
        points: { show: true }
    },
    xaxis: {
      show: false
    },
    yaxis: {
      min: 0,
      max: 100,
      ticks: 5
    },
    legend: {
      container: legendcontainer,
      noColumns: 1
    }
   };
   $(idnum).on('shown.bs.popover', function () {
     $.plot(idnumpop,[{ label: "Class", data: $scope.classDataSet, color: "DodgerBlue" },
                      { label: "Student", data: $scope.createStudentData(index), clickable: true }]
                      ,options);
   });
  };

  $scope.setStudent = function (student) {
  };

$scope.plotitv2 = function(index){
   var idnum = '#student'+index;
   var idnumpop = '#studentplot'+index;
   var someNum = $scope.tofloor(index / $scope.sizeAssessment[0]);
   var studentArr = $scope.createStudentData(someNum);
   var legendcontainer = '#legend'+index;
   var options = {
    series: {
        lines: { show: true },
        points: { show: true }
    },
    xaxis: {
      show: false
    },
    yaxis: {
      min: 0,
      max: 100,
      ticks: 5
    },
    legend: {
      container: legendcontainer,
      noColumns: 1
    }
   };
   $(idnum).on('shown.bs.popover', function () {
     $.plot(idnumpop,[{ label: "Class", data: $scope.classDataSet, color: "DodgerBlue" },
                      { label: "Student", data: $scope.createStudentData(someNum), clickable: true }]
                      ,options);
   });
  };

  $scope.createTemplate = function(index) {
    var testTemplate;
    var student = $scope.students[index];
    
      var datasets = [{
        filterType: 'students',
        filterDatum: {id: student.id, value: student.fname + ' ' + student.lname},
        termId: $scope.section.term.id,
        sectionId: $scope.section.id,
        assessmentTypeId: $scope.assessment_type.id,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      }, {
        filterType: null,
        filterDatum: null,
        termId: $scope.section.term.id,
        sectionId: $scope.section.id,
        assessmentTypeId: $scope.assessment_type.id,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      }];

      var graphUrl = '#/performance?datasets=' + encodeURIComponent(JSON.stringify(datasets));
      testTemplate = '<div style="height: 90px; width: 210px;"><a href="' + graphUrl + '"><div id="studentplot' + index +'" style="height: 90px; width: 150px;"></div></a><div id="legend' + index +'" style="position:absolute;top: 50px; left: 165px;"></div></div>';
    
    return testTemplate;
  };

  $scope.createTemplate2 = function(index) {
    var testTemplate;
    var student = $scope.students[$scope.tofloor(index / $scope.sizeAssessment[0])];
    
      var datasets = [{
        filterType: 'students',
        filterDatum: {id: student.id, value: student.fname + ' ' + student.lname},
        termId: $scope.section.term.id,
        sectionId: $scope.section.id,
        assessmentTypeId: $scope.assessment_type.id,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      }, {
        filterType: null,
        filterDatum: null,
        termId: $scope.section.term.id,
        sectionId: $scope.section.id,
        assessmentTypeId: $scope.assessment_type.id,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      }];

      var graphUrl = '#/performance?datasets=' + encodeURIComponent(JSON.stringify(datasets));
      testTemplate = '<div style="height: 90px; width: 210px;"><a href="' + graphUrl + '"><div id="studentplot' + index +'" style="height: 90px; width: 150px;"></div></a><div id="legend' + index +'" style="position:absolute;top: 50px; left: 165px;"></div></div>';
    
    return testTemplate;
  };


  $scope.createStudentData = function(indexx){
    //console.log(indexx);
    var scores = [];
    for(var i = 0; i < $scope.students[indexx].assessmentPercent.length; i++){
      scores.push([i,$scope.students[indexx].assessmentPercent[i]]);
    }
    //console.log(scores);
    return scores;
  };

assessment_type.getList('assessments').then(function(thereturn){
  $scope.assessments = thereturn;
  $scope.editView2Assessments = Restangular.copy(thereturn);
  $scope.editView3Assessments = Restangular.copy(thereturn);

  //====================================================only needed for assessment 3===============================================================
  angular.forEach($scope.editView3Assessments, function(assessment){
    Restangular.one('assessments', assessment.id).getList('criterions').then(function(criteria){
      assessment.criterions = criteria;
    });
  });
  /*
  for(var i = 0; i <  $scope.editView3Assessments.length; i++){
    $scope.editView3Assessments[i].criterions = criterions[i];
    console.log($scope.editView3Assessments[i]);
  }*/

  //console.log($scope.assessments[0]);
  Restangular.one('assessments', $scope.assessments[0].id).getList('criterions').then(function(thereturn1){
    $scope.editView2Criterions = thereturn1;
  });

  Restangular.all('criterions').getList({assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
    $scope.criterions = thereturn;


	$scope.numOfCrit = [];
	$scope.numOfCrit[0] = 0;
	$scope.startOfCrit = [];
	$scope.startOfCrit[0] = 0;
	$scope.showAssessment = [];
	$scope.showAssessment[0] = true;
	var currentassessment = thereturn[0].assessment_id;
	var z = 0;
	for(var i = 0; i < thereturn.length; i++){
		if(thereturn[i].assessment_id == currentassessment){
			$scope.numOfCrit[z] = $scope.numOfCrit[z] + 1;
			//$scope.showAssessment[i] = false;
		}else{
			z = z + 1;
			currentassessment = thereturn[i].assessment_id;
			//$scope.showAssessment[i] = true;
			$scope.startOfCrit[z] = i;
			$scope.numOfCrit[z] = 1;
		}
	}
	
	z = 0;
	currentassessment = thereturn[0].assessment_id;
	for(var i = 1; i < thereturn.length; i++){
    if(thereturn[i].assessment_id == currentassessment){
      $scope.showAssessment[i] = false;
    }else{
      z = z + 1;
      currentassessment = thereturn[i].assessment_id;
      $scope.showAssessment[i] = true;
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

  $scope.numOfCritArray = [];
  for(var i = 0; i < $scope.numOfCrit.length; i++){
    $scope.numOfCritArray[i] = $scope.range($scope.numOfCrit[i]);
  }





	Restangular.all('studentassessments').getList({section_id: $routeParams.section_id, assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
	   $scope.students = thereturn;

      $scope.showArray = [];
      for(var j = 0; j < $scope.assessments.length; j++){
        $scope.showArray[j] = [];
        for(var i = 0; i < $scope.numOfCrit[j]; i++){
          if( i == 0){
            $scope.showArray[j][i] = true;
          }else{
            $scope.showArray[j][i] = false;
          }
        }
      }

	   //Calculating Criterion Totals
	     $scope.studentbycrit = $scope.range($scope.sizeAssessment[0] * thereturn.length);

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
    	   if(isNaN($scope.criterions.percent[i])){
    	     $scope.criterions.percent[i] = 0;
    	   }
       }

       //console.log($scope.criterions);
       
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
    	   if(isNaN($scope.assessments[i].percent)){
    	     $scope.assessments[i].percent = 0;
    	   }
       }

       //Calculating Student Totals
       for(var i = 0; i < thereturn.length ; i++){
        $scope.students[i].total = 0;
        $scope.students[i].max = 0;
         for(var j = 0; j < $scope.criterions.length; j++){
          $scope.students[i].total = $scope.students[i].total + thereturn[i].scores[j].score;
          if($scope.criterions.present[j] != 0){
            $scope.students[i].max = $scope.students[i].max + $scope.criterions[j].max;  
          }
          
         }
       }

       for(var i = 0; i < thereturn.length; i++){
         $scope.students[i].percent = Math.floor($scope.students[i].total / $scope.students[i].max * 100);
         if(isNaN($scope.students[i].percent)){
           $scope.students[i].percent = 0;
         }
       }

       //Calculating class total
       $scope.section.totalscore = 0;
       $scope.section.maxscore = 0;
       $scope.section.present = 0;
       for(var i = 0; i < $scope.assessments.length; i++){
         if($scope.assessments[i].present != 0){
           if(!isNaN($scope.assessments[i].percent)){
             $scope.section.totalscore += $scope.assessments[i].total;
             $scope.section.maxscore += $scope.assessments[i].max;
             if($scope.section.present < $scope.assessments[i].present){
               $scope.section.present = $scope.assessments[i].present;
             }
           }   
         }
       }   
       
       $scope.section.totalpercent = Math.floor($scope.section.totalscore / $scope.section.maxscore / $scope.section.present * 100);
       if(isNaN($scope.section.totalpercent)){
         $scope.section.totalpercent = 0;
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
     	 if(isNaN($scope.criterions[i].studentPercent)){
         $scope.criterions[i].studentPercent = 0;
         $scope.criterions[i].studentAverage = 0;
       }
       }

       $scope.classDataSet = [];
       for(var i = 0; i < $scope.assessments.length; i++){
         $scope.classDataSet.push([i,$scope.assessments[i].percent]);
       }

       $scope.maxNumOfCrit = $scope.numOfCrit[0];
       for(var i = 0; i < $scope.numOfCrit.length; i++){
         if($scope.maxNumOfCrit < $scope.numOfCrit[i]){
           $scope.maxNumOfCrit = $scope.numOfCrit[i];
         }
       }



    $('div#loadingIcon').hide();
    $('div#assessmentTable').show("fast", function(){
      $("[rel=popover]").popover({
        html: true,
        placement : 'right',
        trigger: 'click',
      });
      
      $("[rel=popover-down]").popover({
        html: true,
        placement : 'bottom',
        trigger: 'click',
      });
    });

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
    if(criterion.score != null){
    if(criterion.score != null && criterion.score.length != 0){
      criterion.score = Number(criterion.score);
    }}
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
              $scope.criterions.total[j] = $scope.criterions.total[j] + $scope.students[i].scores[j].score;
            }
         }
       }

       for(var i = 0; i < $scope.criterions.length; i++){
         $scope.criterions.percent[i] = Math.floor($scope.criterions.total[i] / $scope.criterions.present[i] / $scope.criterions[i].max * 100);
         if(isNaN($scope.criterions.percent[i])){
           $scope.criterions.percent[i] = 0;
         }
       }

    //This section is for calculating the Students totals
    for(var i = 0; i < $scope.students.length ; i++){
      $scope.students[i].total = 0;
      $scope.students[i].max = 0;
      for(var j = 0; j < $scope.criterions.length; j++){
        if($scope.students[i].scores[j].score != null){
          $scope.students[i].total = $scope.students[i].total + $scope.students[i].scores[j].score;
        }
        if($scope.criterions.present[j] != 0){
          $scope.students[i].max = $scope.students[i].max + $scope.criterions[j].max;  
        }
       	
      }
    }

    for(var i = 0; i < $scope.students.length; i++){
      $scope.students[i].percent = Math.floor($scope.students[i].total / $scope.students[i].max * 100);
      if(isNaN($scope.students[i].percent)){
        $scope.students[i].percent = 0;
      }
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
       if(isNaN($scope.assessments[i].percent)){
         $scope.assessments[i].percent = 0;
       }
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
     	 if(isNaN($scope.criterions[i].studentPercent)){
     	   $scope.criterions[i].studentPercent = 0;
     	   $scope.criterions[i].studentAverage = 0;
     	 }
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

     //Calculating class total
       $scope.section.totalscore = 0;
       $scope.section.maxscore = 0;
       $scope.section.present = 0;
       for(var i = 0; i < $scope.assessments.length; i++){
         if($scope.assessments[i].present != 0){
           if(!isNaN($scope.assessments[i].percent)){
             $scope.section.totalscore += $scope.assessments[i].total;
             $scope.section.maxscore += $scope.assessments[i].max;
             if($scope.section.present < $scope.assessments[i].present){
               $scope.section.present = $scope.assessments[i].present;
             }
           }   
         }
       }   
       
       $scope.section.totalpercent = Math.floor($scope.section.totalscore / $scope.section.maxscore / $scope.section.present * 100);
       if(isNaN($scope.section.totalpercent)){
         $scope.section.totalpercent = 0;
       }


       $scope.classDataSet = [];
       for(var i = 0; i < $scope.assessments.length; i++){
         $scope.classDataSet.push([i,$scope.assessments[i].percent]);
       }
  };

  $scope.checkVal = function(criterion) {
  	//criterion.score = Number(criterion.score);
  	$scope.oldValue = Number(criterion.score);
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


  $scope.back = function(){
    location.reload();
  };

  $scope.edit = function(){
    $('div#assessmentTable').hide();
    $('div#editButton').hide();
    $('div#backButton').show();
    $('div#editAssessment').show();
  };
});





/*
 * ========================================================edit view 1 controller========================================================
 */
app.controller('EditRunChartCtrl', function($scope, $routeParams, Restangular){


  $scope.newCriterion = function() {
    var newCrit = {
      max: $scope.criterions[$scope.criterions.length-1].max, //gives new criterions the value for max the same as the last criterion in the assessment
      name: ($scope.criterions.length + 1).toString()
    };

    var newAssessment = {
      data_type: 1,
      subject: "hello",
      name: newCrit.name,
      assessment_type_id: $scope.assessment_type.id
    };
    var restCopy1 = Restangular.copy(newAssessment);
    restCopy1.route = "assessments";
    restCopy1.post().then(function(thereturn){
      newCrit.assessment_id = thereturn.id;
      newAssessment.id = thereturn.id;
      $scope.assessments.push(newAssessment);
      var editable = Restangular.copy(newCrit);
      editable.route = "criterions";
      editable.post().then(function(thereturn){
        newCrit.id = thereturn.id;
        //console.log(newCrit);
        $scope.criterions.push(newCrit);
      });
    });
  };

  $scope.remove = function(criterion, index) {
    Restangular.one("assessments",criterion.assessment_id).remove();//dont need to remove criterion when removing assessment takes care of removing its criterions
    $scope.criterions.splice(index, 1);
    $scope.assessments.splice(index, 1);
  };

  $scope.changedOldCriterion = function(criterion, index){
    var editedCrit = Restangular.copy(criterion);
    editedCrit.route = "criterions";
    editedCrit.put();
    $scope.assessments[index].name = $scope.criterions[index].name;
    var editedAssess = Restangular.copy($scope.assessments[index]);
    editedAssess.route = "assessments";
    editedAssess.put();
  };

  $scope.changeAssessmentTypeName = function(){
    $scope.assessment_type.name = $scope.assessment_type_name;
    $scope.assessment_type.put();
  };
});


/*
 * =====================================================edit view 2 controller========================================================
 */
app.controller('EditCriteriaBasedCtrl', function($scope, $routeParams, Restangular){

  $scope.newCriterion = function() {
    var newCrit = {
      max: $scope.editView2Criterions[$scope.editView2Criterions.length-1].max, //gives new criterions the value for max the same as the last criterion in the assessment
      name: ($scope.editView2Criterions.length + 1)
    };

    var critLength = $scope.editView2Criterions.length;
    console.log("critLength is " + critLength);
    var i = 0;
    angular.forEach($scope.editView2Assessments, function(assessment){
      var newCrit = {
        max: $scope.editView2Criterions[$scope.editView2Criterions.length-1].max, //gives new criterions the value for max the same as the last criterion in the assessment
        name: ($scope.editView2Criterions.length + 1)
      };
      newCrit.assessment_id = assessment.id;
      var newCritRestCopy = Restangular.copy(newCrit);
      newCritRestCopy.route = "criterions";
      newCritRestCopy.post().then(function(thereturn){
        newCritRestCopy.id = thereturn.id;
        if(newCritRestCopy.assessment_id == $scope.editView2Assessments[0].id){
          $scope.editView2Criterions.push(thereturn);
        }
        //$scope.criterions.push(thereturn);
        console.log(i);
        //console.log(critLength);
        console.log(critLength + (i * critLength));
        $scope.criterions.splice((critLength + (i * critLength) + i), 0, newCritRestCopy);
        console.log($scope.criterions);
        console.log($scope.editView2Criterions);
        i++;
      });
    });
  };

  $scope.newAssessment = function() {
    var newAssess = {
      data_type: 1,
      subject: "hello",
      name: ($scope.editView2Assessments.length + 1),
      assessment_type_id: $scope.assessment_type.id
    };

    var newAssessRestCopy = Restangular.copy(newAssess);
    newAssessRestCopy.route = "assessments";
    newAssessRestCopy.post().then(function(thereturn){
      newAssessRestCopy.id = thereturn.id;
      angular.forEach($scope.editView2Criterions, function(criterion){
        var newCrit = {
          max: criterion.max,
          name: criterion.name,
          assessment_id: newAssessRestCopy.id
        };
        console.log(criterion.name);
        console.log(criterion.max);
        newCritRestCopy = Restangular.copy(newCrit);
        newCritRestCopy.route = "criterions";
        newCritRestCopy.post().then(function(thereturn){
          newCrit.id = thereturn.id;
          newCrit.route = "criterions";
          console.log(newCrit);
          $scope.criterions.push(newCrit);            
        });
      });
      console.log(newAssessRestCopy);
      $scope.editView2Assessments.push(newAssessRestCopy);
      console.log($scope.criterions);
    });
  };

  $scope.removeCriterion = function(criterion, index) {
    console.log($scope.criterions);
    for(var i = 0; i < $scope.editView2Assessments.length; i++){
      console.log(index + (i * $scope.editView2Criterions.length));
      console.log($scope.criterions[index + (i * $scope.editView2Criterions.length)].id);
      Restangular.one("criterions", $scope.criterions[index + (i * $scope.editView2Criterions.length)].id).remove();
    }
    console.log("FINISHED REMOVE.ONE");
    var indexToRemoveEdit = $scope.editView2Criterions.indexOf(criterion);
    console.log("WELL??");
    for(var i = 0; i < $scope.editView2Assessments.length; i++){
      console.log(indexToRemoveEdit + (i * $scope.editView2Criterions.length));
      $scope.criterions.splice((indexToRemoveEdit + (i * $scope.editView2Criterions.length)), 1);
    }    
    $scope.editView2Criterions.splice(indexToRemoveEdit, 1);
  };

  $scope.removeAssessment = function(assessment, index) {
    console.log($scope.criterions);
    console.log(index);
    Restangular.one("assessments", $scope.editView2Assessments[index].id).remove();
    angular.forEach($scope.editView2Criterions, function(criterion){
      console.log((index * $scope.editView2Criterions.length));
      $scope.criterions.splice((index * $scope.editView2Criterions.length), 1);
    });
    $scope.editView2Assessments.splice(index, 1);
    console.log($scope.criterions);
  };

  $scope.changedOldCriterion = function(criterion, index){
    console.log($scope.criterions);
    console.log($scope.editView2Criterions);
    console.log("length of assessments" + $scope.editView2Assessments.length);
    for(var j = 0; j < $scope.editView2Assessments.length; j++){
      console.log(index + (j * $scope.editView2Criterions.length));
      console.log($scope.criterions[index + (j * $scope.editView2Criterions.length)]);
      var editable = Restangular.copy($scope.criterions[index + (j * $scope.editView2Criterions.length)]);
      editable.name = criterion.name;
      editable.max = criterion.max;
      //editable.route = "criterions";
      editable.put();
    }
  };

  $scope.changedOldAssessment = function(assessment, index){
    var editable = Restangular.copy($scope.editView2Assessments[index]);
    editable.route = "assessments";
    editable.put();
  };

  $scope.changeAssessmentTypeName = function(){
    $scope.assessment_type.name = $scope.assessment_type_name;
    $scope.assessment_type.put();
  };
});


/*
 * ========================================================edit view 3 controller========================================================
 */
app.controller('EditStandardsBasedCtrl', function($scope, $routeParams, Restangular){

  $scope.newCriterion = function(index) {
    var newCrit = {
      max: $scope.editView3Assessments[index].criterions[$scope.editView3Assessments[index].criterions.length-1].max, //gives new criterions the value for max the same as the last criterion in the assessment
      name: ($scope.editView3Assessments[index].criterions.length + 1)
    };

    newCrit.assessment_id = $scope.editView3Assessments[index].id;
    var newCritRestCopy = Restangular.copy(newCrit);
    newCritRestCopy.route = "criterions";
    newCritRestCopy.post().then(function(thereturn){
      newCritRestCopy.id = thereturn.id;
      $scope.editView3Assessments[index].criterions.push(newCritRestCopy);
    });
  };

  $scope.newAssessment = function() {
    var newAssess = {
      data_type: 1,
      subject: $scope.editView3Assessments[$scope.editView3Assessments.length - 1].subject,
      name: ($scope.editView3Assessments.length + 1),
      assessment_type_id: $scope.assessment_type.id,
      criterions: []
    };

    var newAssessRestCopy = Restangular.copy(newAssess);
    newAssessRestCopy.route = "assessments";
    newAssessRestCopy.post().then(function(thereturn){
      newAssessRestCopy.id = thereturn.id;
      var newCrit = {
        max: $scope.editView3Assessments[$scope.editView3Assessments.length - 1].criterions[$scope.editView3Assessments[$scope.editView3Assessments.length - 1].criterions.length - 1].max,
        name: 1,
        assessment_id: newAssessRestCopy.id
      };
      newCritRestCopy = Restangular.copy(newCrit);
      newCritRestCopy.route = "criterions";
      newCritRestCopy.post().then(function(thereturn){
        $scope.editView3Assessments.push(newAssessRestCopy);
        newCritRestCopy.id = thereturn.id;
        $scope.editView3Assessments[$scope.editView3Assessments.length - 1].criterions.push(newCritRestCopy);
      });
    });
  };



  $scope.removeCriterion = function(parentIndex, index) {
    Restangular.one("criterions",$scope.editView3Assessments[parentIndex].criterions[index].id).remove();
    $scope.editView3Assessments[parentIndex].criterions.splice(index, 1);
  };

  $scope.removeAssessment = function(index) {
    var editable = $scope.editView3Assessments[index];
    editable.route = "assessments";
    editable.remove();
    $scope.editView3Assessments.splice(index, 1);
  };

  $scope.changedOldCriterion = function(criterion, parentIndex, index){
    var newCritRestCopy = Restangular.copy(criterion);
    newCritRestCopy.route = "criterions";
    newCritRestCopy.put();
  };

  $scope.changedOldAssessment = function(assessment, index){
    var newAssessRestCopy = Restangular.copy(assessment);
    newAssessRestCopy.route = "assessments";
    newAssessRestCopy.put();
  };

  $scope.changeAssessmentTypeName = function(){
    $scope.assessment_type.name = $scope.assessment_type_name;
    $scope.assessment_type.put();
  };
});