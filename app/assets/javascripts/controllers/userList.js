// user list
app.controller('UserListCtrl', function($scope, Restangular) {
  Restangular.all('users').getList().then(function(users) {
    $scope.users = users;
  });
	
	//used for when a user toggles the "show inactive/active" button
	$scope.activateUsersButton = function() {
		$scope.active = !$scope.active;
	};
});

//controller for "create user" modal dialog 
app.controller('AddUser', function($scope, Restangular) {
  $scope.save = function() {
    var newUser = angular.copy($scope.newUser); //copy model of user in fields
    newUser.is_active = true; // TODO make is_active default to true in the DB
    newUser.password = "we56h"; //TODO should implement password system, possibly here.
    Restangular.all('users').post(newUser).then(function(response) {
      $scope.users.push(response);
    });
    $scope.newUser = null; // reset the form
  };
});