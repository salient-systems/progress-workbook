// user details page
app.controller('UserCtrl', function($scope, $routeParams, Restangular) {
  var user = Restangular.one('users', $routeParams.id);
  user.get().then(function(theuser) {
    $scope.user = theuser;
    $scope.editUser = {
      fname: theuser.fname,
      lname: theuser.lname,
      is_admin: theuser.is_admin,
      username: theuser.username
    };
  });

  $scope.sections = user.getList('sections');

  $scope.save = function() {
    $scope.user.fname = $scope.editUser.fname;
    $scope.user.lname = $scope.editUser.lname;
    $scope.user.is_admin = $scope.editUser.is_admin;
    $scope.user.username = $scope.editUser.username;
    $scope.user.put();
  };
});