// user details page
app.controller('UserCtrl', function($scope, $routeParams, Users, UserClasses) {
  $scope.user = Users.get({id: $routeParams.id});

  $scope.data = {};
  $scope.data.sections = UserClasses.query({id: $routeParams.id});
});