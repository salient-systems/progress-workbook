// Class list
app.controller('SectionListCtrl', function($scope, $rootScope, Restangular) {
  Restangular.all('sections').getList().then(function(sections) {
    $scope.sections = sections;
  });
  $scope.selections = [];
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'sections',
    selectedItems: $scope.selections,
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
    ]
  };

  $scope.deleteSection = function() {
    _.each($scope.selections, function(section, key) {
      Restangular.one('sections', section.id).remove().then(function() {
        $scope.sections = _.without($scope.sections, section);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
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
    $('#createSectionModal').modal('hide');
    $scope.newSection = null; // reset the form
    $scope.resetValidation();
  };

  $scope.resetValidation = function() {
    $scope.newSection = null;
    $scope.validateName = false;
    $scope.validateSubject = false;
    $scope.validatePeriod = false;
    $scope.validateGrade = false;
  };
});