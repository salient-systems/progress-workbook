// student list
app.controller('StudentListCtrl', function($scope, $rootScope, Restangular) {

  $scope.active = true;
  Restangular.all('students').getList({"is_active":$scope.active}).then(function(students) {
    $scope.students = students;
  });

  $scope.selections = [];
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: true,
    enableCellEditOnFocus: true,
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
        displayName: 'Student ID',
        enableCellEdit: false,
        //editableCellTemplate: editTemplate
      }, {
        field: 'grade_level',
        displayName: 'Grade Level',
        enableCellEdit: false,
        //editableCellTemplate: editTemplate
      }
    ]
  };

  $scope.save = function() {
    //console.log(row.entity);
    //console.log(column.field);
    //console.log('Cell Value prior: ' + row.entity[column.field]);
    //console.log('Cell Value after: ' + cellValue);
    this.row.entity.put();
  };

  $scope.deleteStudent = function() {
    _.each($scope.selections, function(student, key) {
      student.remove().then(function() {
        $scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.toggleActiveStudent = function() {
    _.each($scope.selections, function(student, key) {
      student.is_active = !$scope.active;
      student.put().then(function() {
        $scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  //toggles boolean for active or deactive students to be displayed
  $scope.activateStudentsButton = function() {
		$scope.active = !$scope.active;
		Restangular.all('students').getList({"is_active":$scope.active}).then(function(students) {
    	  $scope.students = students;
  		});
	};
});

app.controller('AddStudent', function($scope, Restangular) {
  $scope.save = function() {
    var newStudent = angular.copy($scope.newStudent);
    newStudent.is_active = true; // TODO make is_active default to true in the DB
    Restangular.all('students').post(newStudent).then(function(response) {
      $scope.students.push(response);
    });
    $scope.newStudent = null; // reset the form
    $('#addStudentModal').modal('hide');
    $scope.resetValidation();
  };

  $scope.resetValidation = function() {
    $scope.newStudent = null;
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateSid = false;
    $scope.validateGrade = false;
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
