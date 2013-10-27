// student list
app.controller('StudentListCtrl', function($scope, Restangular) {
  $scope.checked_students = [];
  $scope.predicate = 'lname';
  $scope.students = Restangular.all('students').getList();
  $scope.myData = $scope.students;
  $scope.mySelections = [];
  $scope.cellValue;
  var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"number\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";

  $scope.gridOptions = {
    data: 'myData',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellEditOnFocus: true,
    filterOptions: {filterText: '', useExternalFilter: false},
    columnDefs: [ { field: 'fname', displayName: 'First Name', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a></div>'},
                  { field: 'lname', displayName: 'Last Name', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a></div>'},
                  { field: 'grade_level', displayName: 'Grade Level', enableCellEdit: true, editableCellTemplate: cellEditableTemplate},
                  //{ displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'}
                ],
    afterSelectionChange: function () {
    $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push( item.id );
      });
      }
  };

  $scope.updateEntity = function(column, row, cellValue) {
    console.log(row.entity);
    console.log(column.field);
    console.log('Cell Value prior: ' + row.entity[column.field]);
    console.log('Cell Value after: ' + cellValue);
    var student = $scope.students.query({id: row.entity.id});
    console.log('students id: ' + $scope.students[row].id);

    // back end logic to update new cell value
    if (cellValue != row.entity[column.field]){
      student.grade_level = cellValue;
      student.$save();
    }
    // Upon sucessfull back end update
    row.entity[column.field] = cellValue;
  };

  //toggles boolean for active or deactive students to be displayed
  $scope.activateStudentsButton = function() {
		$scope.active = !$scope.active;
	};
});