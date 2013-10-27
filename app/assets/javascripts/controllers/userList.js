// user list
app.controller('UserListCtrl', function($scope, Users) {
  $scope.data = {};

  Users.query(function(response) {
    $scope.data.users = response;
  });

	$scope.activateUsersButton = function() {
		$scope.active = !$scope.active;
	};
});