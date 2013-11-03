// section details
app.controller('SectionCtrl',
function($scope, $routeParams, Restangular) {
  var section = Restangular.one('sections', $routeParams.id);
  $scope.section = section.get();
  $scope.students = section.getList('students');
  $scope.assessment_types = section.getList('assessment_types');
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
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