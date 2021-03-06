// user list
app.controller('UserListCtrl', function($scope, Restangular, $location) {
  $scope.active = true;
  Restangular.all('users').getList({"is_active":$scope.active}).then(function(users) {
    $scope.users = users;
  });

	$scope.selections = [];
  	var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';
  	var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/users/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';

	$scope.gridOptions = {
    data: 'users',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    sortInfo: {fields:['lname'], directions:['asc']},
    //enableCellEditOnFocus: true, //assuming you dont want to edit displayed user information
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      //if you want to add a size of cohort column, you'll need to implement it here using the same 4 fields for Cohort column as seen below.
      {
        field: 'lname',
        displayName:'Last Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false
      }, {
        field: 'fname',
        displayName:'First Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false
      }, {
        field: 'username',
        displayName: 'Username',
        enableCellEdit: false
      }, {
        field: 'is_admin',
        displayName: 'Admin',
        cellTemplate: 'templates/tableAdminIcon.html',
        enableCellEdit: false,
        width: '5%'
      }
    ]
  };

  $scope.deleteUser = function() {
    _.each($scope.selections, function(user, key) {
      Restangular.one('users', user.id).remove().then(function() {
        $scope.users = _.without($scope.users, user);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.promoteAdmin = function() {
    _.each($scope.selections, function(user, key) {
      user.is_admin = true;
      user.put();
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.demoteAdmin = function() {
    _.each($scope.selections, function(user, key) {
      user.is_admin = false;
      user.put();
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

  $scope.toggleActiveUser = function() {
    _.each($scope.selections, function(user, key) {
      user.is_active = !$scope.active;
      user.put().then(function() {
        $scope.users = _.without($scope.users, user);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

	//used for when a user toggles the "show inactive/active" button
	$scope.activateUsersButton = function() {
		$scope.active = !$scope.active;
		Restangular.all('users').getList({"is_active":$scope.active}).then(function(users) {
    	  $scope.users = users;
  		});
	};
});

//controller for "create user" modal dialog
app.controller('AddUser', function($scope, Restangular) {
  $scope.newUser = {};
  $scope.newUser.is_admin = false;
  $scope.save = function() {
    var newUser = angular.copy($scope.newUser); //copy model of user in fields
    newUser.is_active = true; // TODO make is_active default to true in the DB
    Restangular.all('users').post(newUser).then(function(response) {
      $scope.users.push(response);
    });
    $scope.newUser = null; // reset the form
    $('#createUserModal').modal('hide');
    $scope.resetValidation();
  };

  $scope.resetValidation = function() {
    $scope.newUser = null;
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateUsername = false;
    $scope.validatePassword = false;
  };
});