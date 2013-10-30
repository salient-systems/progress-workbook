// Class list
app.controller('ClassListCtrl', function($scope, Restangular) {
  $scope.sections = Restangular.all('sections').getList();
  
  	/*$scope.mySelections = [];
  	var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  	var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  
	$scope.gridOptions = {
    data: 'sections',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    //enableCellEditOnFocus: true, //assuming you dont want to edit displayed user information
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      //if you want to add a size of cohort column, you'll need to implement it here using the same 4 fields for Cohort column as seen below.
      {
        field: 'name',
        displayName:'Title',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'subject_id',
        displayName:'Subject',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'grade_level',
        displayName: 'Grade',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      },{
        field: , 
        displayName: 'Teacher',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      },
        //displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };*/
  
});