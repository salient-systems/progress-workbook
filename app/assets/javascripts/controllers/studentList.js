// student list
app.controller('StudentListCtrl', function($scope, Restangular) {
  $scope.students = Restangular.all('students').getList();
  $scope.checked_students = [];
  $scope.mySelections = [];
  $scope.cellValue;
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty("fname")}} {{row.getProperty("lname")}}</a></div>';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellEditOnFocus: true,
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'fname',
        displayName:'Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'grade_level',
        displayName: 'Grade Level',
        enableCellEdit: true,
        editableCellTemplate: editTemplate
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