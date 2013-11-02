// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  user.get().then(function(theuser) {
    $scope.user = theuser;
    $scope.editUser = {
      fname: theuser.fname,
      lname: theuser.lname,
      username: theuser.username,
      is_admin: theuser.is_admin
    };
  });
  $scope.sections = user.getList('sections');

  $scope.save = function() {
    console.log($scope.editUser);
    $scope.user.patch($scope.editUser);
  };
});