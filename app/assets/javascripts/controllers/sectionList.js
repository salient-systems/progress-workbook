// Class list
app.controller('SectionListCtrl', function($scope, $rootScope, Restangular) {
  if ($rootScope.sections === undefined) {
    $rootScope.sections = Restangular.all('sections').getList();
    $scope.sections = $rootScope.sections;
  } else {
    $scope.sections = $rootScope.sections;
  }

  $scope.mySelections = [];
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';


  $scope.gridOptions = {
    data: 'sections',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['name'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'name',
        displayName:'Title',
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>',
        enableCellEdit: false,
        width: '35%'
      }, {
        field: 'subject.name',
        displayName:'Subject',
        enableCellEdit: false,
        width: '15%'
      }, {
        field: 'period',
        displayName: 'Period'
      },{
        field: 'grade_level',
        displayName: 'Grade'
      },{
        field: 'user.fname',
        displayName: 'Teacher',
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/users/{{row.getProperty(\'user.id\')}}">{{row.getProperty(\'user.fname\')}} {{row.getProperty(\'user.lname\')}}</a></div>',
        width: '30%'
      }
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };


});

app.controller('AddSection', function($scope, Restangular) {
  Restangular.all('subjects').getList().then(function(thesubjects) {
    $scope.subjects = thesubjects;
  });

  $scope.save = function() {
    var newSection = angular.copy($scope.newSection);
    newSection.user_id = 1; //TODO get id of the logged in user
    Restangular.all('sections').post(newSection).then(function(response) {
      $scope.sections.push(response);
    });
    $scope.newSection = null; // reset the form
    $('#createSectionModal').modal('hide');
  };

});