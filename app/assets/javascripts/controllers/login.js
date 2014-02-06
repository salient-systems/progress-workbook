app.controller('LoginCtrl', function($scope, $http, UserService, $location) {

  $scope.login = function() {

    var credentials = {
      username: $scope.username,
      password: $scope.password
    };

    $http.post('/login', credentials).success(function(response) {
      if (response.isValid) {
        UserService.username = response.username;
        UserService.userRole = response.is_admin ? 'admin' : 'teacher';
        //TODO save token to cookie with $cookieStore
        $location.path('/classes');
      }
    });
  };
});