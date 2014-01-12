// cohort list
app.controller('CohortListCtrl', function($scope, Restangular, $location, graphConfig) {
  $scope.graphConfig = graphConfig;
  Restangular.all('cohorts').getList().then(function(cohorts) {
    $scope.cohorts = cohorts;
  });
  $scope.selections = [];
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/cohorts/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';

	$scope.gridOptions = {
    data: 'cohorts',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellEditOnFocus: true,
    sortInfo: {fields:['name'], directions:['asc']},
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
    ]
  };

  $scope.deleteCohort = function() {
    _.each($scope.selections, function(cohort, key) {
      Restangular.one('cohorts', cohort.id).remove().then(function() {
        $scope.cohorts = _.without($scope.cohorts, cohort);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.compare = function() {
    var datasets = [];

    _.each($scope.selections, function(cohort, i) {
      datasets[i] = {
        filterType: 'cohorts',
        filterDatum: {id: cohort.id, value: cohort.name},
        termId: graphConfig.termId,
        sectionId: graphConfig.sectionId,
        assessmentTypeId: graphConfig.assessmentTypeId,
        assessmentId: graphConfig.assessmentId,
        criterionId: graphConfig.criterionId,
        statisticId: graphConfig.statisticId
      };
    });

    $location.path('/performance').search({datasets: encodeURIComponent(JSON.stringify(datasets))});
    console.log(datasets);
  };

  $scope.resetCompareValidation = function() {
    $scope.validateStatistic = false;
    graphConfig.sectionId = null;
    graphConfig.assessmentTypeId = null;
    graphConfig.assessmentId = null;
    graphConfig.criterionId = null;
    graphConfig.statisticId = null;
  };

});

//controller for "add cohort" modal dialog
app.controller('AddCohort', function($scope, Restangular) {
  $scope.save = function() {
    var newCohort = angular.copy($scope.newCohort);
    Restangular.all('cohorts').post(newCohort).then(function(response) {
      $scope.cohorts.push(response);
    });
    $('#createCohortModal').modal('hide');
    $scope.resetValidation();
  };

  $scope.resetValidation = function() {
    $scope.newCohort = null;
    $scope.validateName = false;
  };
});