// cohort details page
app.controller('CohortCtrl',
function($scope, $routeParams, Restangular) {
  var cohort = Restangular.one('cohorts', $routeParams.id);
  $scope.cohort = cohort.get();
  cohort.getList('students').then(function(students) {
    $scope.students = students;
  });

  cohort.getList('students').then(function(sections) {
    $scope.sections = sections;
  });

  cohort.get().then(function(thecohort) {
    $scope.cohort = thecohort;
    $scope.setupEditCohort();
  });
  $scope.selections = [];

  $scope.save = function() {
    $scope.cohort.name = $scope.editCohort.name;
    $scope.cohort.put();
    $('#editCohortModal').modal('hide');
  };

  $scope.setupEditCohort = function() {
    $scope.editCohort = {
      name: $scope.cohort.name
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditCohort();
    $scope.validateName = false;
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
      }/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ]
  };

  $scope.removeFromCohort = function() {
    _.each($scope.selections, function(student, key) {
      Restangular.one('students', students.id).remove().then(function() {
        $scope.students = _.without($scope.students, student);
      });
    });
  };

});