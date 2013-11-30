// section details
app.controller('SectionCtrl',
function($scope, $routeParams, Restangular, $location) {
  var section = Restangular.one('sections', $routeParams.id);

  section.get().then(function(thesection) {
    $scope.section = thesection;
    $scope.setupEditSection();
  });

  section.getList('students').then(function(students) {
    $scope.students = students;
  });
  $scope.selections = [];

  $scope.assessment_types = section.getList('assessment_types');

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

  $scope.removeFromClass = function() { //TODO: Finish implementing after updating Rails
    _.each($scope.selections, function(student, key) {
      class_student = Restangular.one('class_students').get({"section_id": $routeParams.id, "student_id": student.id}).then(function(thereturn){
      	Restangular.one('class_students',thereturn[0].id).remove();
      	$scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
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
});

app.controller('AddAssessment', function($scope, Restangular) {
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

  $scope.resetValidation = function() {
    $scope.newAssessment = null;
    $scope.validateName = false;
    $scope.validateNumAssessments = false;
    $scope.validateStyle = false;
    $scope.validateType = false;
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
});
