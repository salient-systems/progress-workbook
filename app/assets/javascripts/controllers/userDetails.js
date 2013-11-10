// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  user.get().then(function(theuser) {
    $scope.user = theuser;
    $scope.setupEditUser();
  });
  $scope.selections = [];
  user.getList('sections').then(function(sections) {
    $scope.sections = sections;
  });

  $scope.save = function() {
    $scope.user.fname = $scope.editUser.fname;
    $scope.user.lname = $scope.editUser.lname;
    $scope.user.is_admin = $scope.editUser.is_admin;
    $scope.user.username = $scope.editUser.username;
    $scope.user.password = $scope.editUser.password;
    console.log($scope.user.password);
    $scope.user.put();
    $scope.updateRole();
    $('#editUserModal').modal('hide');
  };

  $scope.setupEditUser = function() {
    $scope.editUser = {
      fname: $scope.user.fname,
      lname: $scope.user.lname,
      is_admin: $scope.user.is_admin,
      username: $scope.user.username
    };
    $scope.updateRole();
  };

  $scope.updateRole = function() {
    if($scope.user.is_admin) {
      $scope.role = "Admin";
    }
    else {
      $scope.role = "Teacher";
    }
  };

  $scope.resetValidation = function() {
    $scope.setupEditUser();
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateUsername = false;
    $scope.validatePassword = false;
  };

  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
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
    ]
  };

  $scope.deleteSection = function() {
    _.each($scope.selections, function(section, key) {
      Restangular.one('sections', section.id).remove().then(function() {
        $scope.sections = _.without($scope.sections, section);
      });
    });
  };

});