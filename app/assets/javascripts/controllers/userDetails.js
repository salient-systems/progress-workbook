// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  $scope.user = user.get();
  $scope.sections = user.getList('sections');
});