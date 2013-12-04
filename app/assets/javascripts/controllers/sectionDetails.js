// section details
app.controller('SectionCtrl',
function($scope, $routeParams, Restangular, $location, $http) {
  var section = Restangular.one('sections', $routeParams.id);
  $scope.assessmentTypeToDelete = null;
  
  
  
  
  
  
  
  section.get().then(function(thesection) {
    $scope.section = thesection;
    $scope.setupEditSection();
  });

  section.getList('students').then(function(students) {
    $scope.students = students;
  });
  $scope.selections = [];

  section.getList('assessment_types').then(function(assessmentTypes) {
    $scope.assessment_types = assessmentTypes;
    $scope.assessmentTypeId = assessmentTypes[0].id;
    
    $http.get("/p/sections/"+ $routeParams.id+"/assesstype/"+assessmentTypes[0].id).success(function(data) {
      $scope.thedata = data;
      console.log(data);
      var assessmentTotals = [];
      var assessmentMaxs = [];
      var assessmentPlot = [];
      var xticks = [];
      for(var i = 0; i < data.length; i++){
        assessmentTotals[i] = $scope.sum(data[i].grades);
        assessmentMaxs[i] = $scope.getTotalPossible(data[i]);
        assessmentPlot.push([i,assessmentTotals[i]/assessmentMaxs[i]*100]);
        xticks.push([i,data[i].name]);
      }
      
      var options = {
      series: {
          lines: { show: true,
                   lineWidth: 6 
                 },
          points: { show: true,
                    radius: 4 
                  }
      },
      xaxis: {
        show: true,
        ticks: xticks
      },
      yaxis: {
        min: 0,
        max: 100,
        ticks: 10
      },
      legend: {
        noColumns: 1
      }
     };
     
     $.plot('#graph',[{ label: assessmentTypes[0].name, data: assessmentPlot, color: "DodgerBlue" }],options);
   }); 
  });
  
  
  
  //Restangular.one('assessment_types', $scope.assessmentTypeId).getList('assessments').then(function(assessments) {
  //  $scope.assessments = assessments;
  //});
  
  
  Restangular.all('subjects').getList().then(function(thesubjects) {
    $scope.subjects = thesubjects;
  });



  $scope.save = function() {
    $scope.section.name = $scope.editSection.name;
    $scope.section.subject_id = $scope.editSection.subject_id;
    $scope.section.period = $scope.editSection.period;
    $scope.section.grade_level = $scope.editSection.grade_level;
    $scope.section.put();
    $('#editSectionModal').modal('hide');
  };

  $scope.setupEditSection = function() {
    $scope.editSection = {
      name: $scope.section.name,
      subject_id: $scope.section.subject_id,
      period: $scope.section.period,
      grade_level: $scope.section.grade_level
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditSection();
    $scope.validateName = false;
    $scope.validateSubject = false;
    $scope.validatePeriod = false;
    $scope.validateGrade = false;
  };

  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['lname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'lname',
        displayName:'Last Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'fname',
        displayName:'First Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'sid',
        displayName: 'Student ID'
      },{
        field: 'grade_level',
        displayName: 'Grade Level'
      }
    ]
  };

  $scope.removeFromClass = function() {
    _.each($scope.selections, function(student, key) {
      class_student = Restangular.one('class_students').get({"section_id": $routeParams.id, "student_id": student.id}).then(function(thereturn){
      	Restangular.one('class_students',thereturn[0].id).remove();
      	$scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.deleteAssessmentType = function() {
    var assessType = $scope.assessmentTypeToDelete;
    Restangular.one('assessment_types', assessType.id).remove();
    $scope.assessment_types = _.without($scope.assessment_types, assessType);
    /*
    var section = Restangular.one('sections', $routeParams.id);
        $scope.assessment_types = section.getList('assessment_types');
        console.log($scope.assessment_types);*/

    $scope.assessmentTypeToDelete = null;
  };

  $scope.saveAssessmentTypeId = function(assessmentType) {
    $scope.assessmentTypeToDelete = assessmentType;
  };

  $scope.saveAssessment = function() {
    var newAssessment = angular.copy($scope.newAssessment);
    newAssessment.section_id = $scope.section.id;
    Restangular.all('assessment_types').post(newAssessment).then(function(response) {
      $scope.assessment_types.push(response);
    });
    $('#createAssessmentModal').modal('hide');
    $scope.newAssessment = null; // reset the form
    $scope.resetValidation();
  };

  $scope.plotAssessentType = function(assessmentType) {
    $http.get("/p/sections/"+ $routeParams.id+"/assesstype/"+assessmentType.id).success(function(data) {
      var assessmentTotals = [];
      var assessmentMaxs = [];
      var assessmentPlot = [];
      var xticks = [];
      for(var i = 0; i < data.length; i++){
        assessmentTotals[i] = $scope.sum(data[i].grades);
        assessmentMaxs[i] = $scope.getTotalPossible(data[i]);
        assessmentPlot.push([i,assessmentTotals[i]/assessmentMaxs[i]*100]);
        xticks.push([i,data[i].name]);
      }
      
      var options = {
      series: {
          lines: { show: true,
                   lineWidth: 6 
                 },
          points: { show: true,
                    radius: 4 
                  }
      },
      xaxis: {
        show: true,
        ticks: xticks
      },
      yaxis: {
        min: 0,
        max: 100,
        ticks: 10
      },
      legend: {
        noColumns: 1
      }
     };
     
     $.plot('#graph',[{ label: assessmentType.name, data: assessmentPlot, color: "DodgerBlue" }],options);
   }); 
  };

  $scope.resetValidation = function() {
    $scope.newAssessment = null;
    $scope.validateName = false;
    $scope.validateNumAssessments = false;
    $scope.validateStyle = false;
    $scope.validateType = false;
  };

  $scope.compare = function() {
    var datasets = [];

    _.each($scope.selections, function(student, i) {
      datasets[i] = {
        filterType: 'students',
        filterDatum: {id: student.id, value: student.fname + ' ' + student.lname},
        termId: $scope.section.term.id,
        sectionId: $scope.section.id,
        assessmentTypeId: undefined,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      };
    });

    $location.path('/performance').search({datasets: encodeURIComponent(JSON.stringify(datasets))});
  };

  // add student typeahead
  $('input#studentSearch').typeahead({
    name: 'students',
    prefetch: {
      url: '/students/search.json',
      ttl: 0
    }
  });

  $('span#inClass').hide();
  $('span#addSuccess').hide();
  $('.tt-query').css('background-color','#fff');

  $('input#studentSearch').bind('typeahead:selected', function(obj, datum, name) {
    var studentId = datum.id;

    var inClass = _.find($scope.students, function(student) {
      return student.id == studentId;
    });

    if (inClass === undefined) {
      Restangular.one('students', studentId).get().then(function(student) {
        $scope.students.push(student);
        $('span#addSuccess').fadeIn(500).delay(1500).fadeOut(500);
      });

      Restangular.all('class_students').post({
        student_id: studentId,
        section_id: $scope.section.id
      });
    } else {
      $('span#inClass').fadeIn(500).delay(2000).fadeOut(500);
    }
  });
  
  $scope.sum = function(numbers) {
    var sum = 0;
    for(var i = 0; i < numbers.length; i++){
      if(numbers[i].score){
        sum += numbers[i].score;  
      }
    }
    return sum;
  };
  
  $scope.getTotalPossible = function(assessment) {
    var grades = assessment.grades;
    var criteria = assessment.criteria;
    var sum = 0;

    for (var i in grades) {
      sum += criteria[grades[i].criterion_id].max;
    }
    
    return sum;
  };
  
});

app.controller('AddToCohort', function($scope, Restangular) {
  Restangular.all('cohorts').getList().then(function(thecohorts) {
    $scope.cohorts = thecohorts;
  });

  $scope.addToCohort = function() {
    _.each($scope.selections, function(student, key) {
      Restangular.all('cohort_students').post({student_id: student.id, cohort_id: $scope.cohortId}).then(function(response) {
        //TODO: Alert user that studen was added successfully
      });
    });
    $('#addToCohortModal').modal('hide');
    $scope.resetCohortValidation();
  };

  $scope.resetCohortValidation = function() {
    $scope.cohortId = null;
    $scope.validateCohort = false;
  };
  
  $scope.graphAssessmentTypeOverall = function(dataset, assessments, series) {
    var graphOptions = angular.copy($scope.defaultLineGraphOptions);
    var numStudents = assessments[0].numStudents;

    // total correct or percentage correct
    if (dataset.statisticId == 1 || dataset.statisticId == 2) {
      var maxList = [];
      _.each(assessments, function(assessment) {
        var thisMax = 0;
        _.each(assessment.criteria, function(criterion) {
            thisMax += criterion.max;
        });

        var grades = $scope.sum(_.pluck(assessment.grades, 'score'));

        if (dataset.statisticId == 2) {
          grades = grades / thisMax * numStudents;
        }

        series.data.push([assessment.name, grades]);
        maxList.push(thisMax);
      });

      if (dataset.statisticId == 1) {
        graphOptions.yaxis.max = _.max(maxList) * numStudents;
      } else {
        graphOptions.yaxis.max = 100;
        graphOptions.yaxis.tickSize = 10;
      }
    }

    $scope.graphOptions = graphOptions;
  };
  
  
  $scope.plot = function(dataset, panel) {
    var url = $scope.buildRequestUrl(dataset);
    var series = {
      label: $scope.assessment_types[0].name,
      data: []
    };
    dataset.id = panel.id;

    $http.get(url).success(function(data) {
      if (dataset.criterionId) {
        $scope.graphCriterion(dataset, data[0], series);
      } else if (dataset.assessmentId) {
          $scope.graphAssessment(dataset, data[0], series);
      } else if (dataset.assessmentTypeId) {
        if (dataset.filterType == 'students') {
          $scope.graphAssessmentTypeStudent(dataset, data, series);
        } else {
          $scope.graphAssessmentTypeOverall(dataset, data, series);
        }
      } else {
        // plot overall data for a section
      }

      if (panel.graphPointsIndex != null) {
        $scope.allGraphPoints[dataset.graphPointsIndex] = series;
      } else {
        panel.graphPointsIndex = $scope.allGraphPoints.push(series) - 1;
      }

      // draw the graph
      $.plot("#graph", $scope.allGraphPoints, $scope.graphOptions);
    });
  };
  
});
