// user list
controllers.controller('UserListCtrl', ['$scope', 'Users',
  function($scope, Users) {
    $scope.data = {};
    $scope.predicate = 'lname';

    Users.query(function(response) {
      $scope.data.users = response;
    });
    
	$scope.activateUsersButton = function()
	{
		$scope.active = !$scope.active;
	};
  }]);