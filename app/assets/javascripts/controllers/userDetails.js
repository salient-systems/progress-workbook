// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  user.get().then(function(theuser) {
    $scope.user = theuser;
    $scope.setupEditUser();
  });

  $scope.sections = user.getList('sections');

  $scope.save = function() {
    $scope.user.fname = $scope.editUser.fname;
    $scope.user.lname = $scope.editUser.lname;
    $scope.user.is_admin = $scope.editUser.is_admin;
    $scope.user.username = $scope.editUser.username;
    $scope.user.put();
    $('#editUserModal').modal('hide');
  };

  $scope.setupEditUser = function() {
    $scope.editUser = {
      fname: $scope.user.fname,
      lname: $scope.user.lname,
      is_admin: $scope.user.is_admin,
      username: $scope.user.username
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditUser();
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateUsername = false;
  };

  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
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
        width: '70%',
        resizable: true
      }, {
        field: 'subject.name',
        displayName:'Subject',
        enableCellEdit: false,
        width: '20%',
        resizable: true
      }, {
        field: 'period',
        displayName: 'Period',
        resizable: true
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