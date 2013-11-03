// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  user.get().then(function(thestudent) {
    $scope.user = thestudent;
  });

  $scope.save = function() {
    $scope.user.put();
  };
});