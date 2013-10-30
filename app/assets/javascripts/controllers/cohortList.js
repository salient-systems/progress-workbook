// cohort list
app.controller('CohortListCtrl', function($scope, Restangular) {
  Restangular.all('cohorts').getList().then(function(cohorts) {
    $scope.cohorts = cohorts;
  });
  	$scope.mySelections = [];
  	var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  	var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  
	$scope.gridOptions = {
    data: 'cohorts',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellEditOnFocus: true,
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      //if you want to add a size of cohort column, you'll need to implement it here using the same 4 fields for Cohort column as seen below.
      {
        field: 'name',
        displayName:'Cohort',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
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

});

//controller for "add cohort" modal dialog
app.controller('AddCohort', function($scope, Restangular) {
  $scope.save = function() {
    var newCohort = angular.copy($scope.newCohort);
    Restangular.all('cohorts').post(newCohort).then(function(response) {
      $scope.cohorts.push(response);
    });
    $scope.newStudent = null; // reset the form
  };
});