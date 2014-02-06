app.controller('LoginCtrl', function($scope, Restangular) {

  console.log('login controller');
  $scope.login = function() {
    console.log($scope.username);
    console.log($scope.password);

    var credentials = {
      username: $scope.username,
      password: $scope.password
    };

    $http.post('/login', credentials).success(function(response) {

    });
  };
});