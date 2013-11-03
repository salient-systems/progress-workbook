// student list
app.controller('StudentListCtrl', function($scope, Restangular) {
  Restangular.all('students').getList().then(function(students) {
    $scope.students = students;
  });
  $scope.checked_students = [];
  $scope.mySelections = [];
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: true,
    enableCellEditOnFocus: true,
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
        displayName: 'Student ID',
        enableCellEdit: false,
        //editableCellTemplate: editTemplate
      }, {
        field: 'grade_level',
        displayName: 'Grade Level',
        enableCellEdit: false,
        //editableCellTemplate: editTemplate
      },/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };

  $scope.save = function() {
    //console.log(row.entity);
    //console.log(column.field);
    //console.log('Cell Value prior: ' + row.entity[column.field]);
    //console.log('Cell Value after: ' + cellValue);
    this.row.entity.put();
  };

  //toggles boolean for active or deactive students to be displayed
  $scope.activateStudentsButton = function() {
		$scope.active = !$scope.active;
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
