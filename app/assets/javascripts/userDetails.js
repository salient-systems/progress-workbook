// user details page
controllers.controller('UserCtrl', ['$scope', '$routeParams', 'Users',
  function($scope, $routeParams, Users) {
    $scope.user = Users.get({id: $routeParams.id});
  }]);