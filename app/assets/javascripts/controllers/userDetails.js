// user details page
app.controller('UserCtrl', ['$scope', '$routeParams', 'Users', 'UserClasses',
  function($scope, $routeParams, Users, UserClasses) {
    $scope.user = Users.get({id: $routeParams.id});

    $scope.data = {};
    $scope.data.sections = UserClasses.query({id: $routeParams.id});
  }]);