// section details
app.controller('SectionCtrl',
function($scope, $routeParams, Restangular) {
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
    sortInfo: {fields:['fname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'fname',
        displayName:'First Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'lname',
        displayName:'Last Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'sid',
        displayName: 'Student ID'
      },{
        field: 'grade_level',
        displayName: 'Grade Level'
      },/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ]
  };

  $scope.removeFromClass = function() { //TODO: Finish implementing after updating Rails
    _.each($scope.selections, function(student, key) {
      Restangular.one('students', students.id).remove().then(function() {
        $scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

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
