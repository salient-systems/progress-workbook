// user list
app.controller('UserListCtrl', function($scope, Restangular) {
  $scope.users = Restangular.all('users').getList();

	$scope.activateUsersButton = function() {
		$scope.active = !$scope.active;
	};
});