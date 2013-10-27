// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Students, StudentClasses) {
  $scope.student = Students.get({id: $routeParams.id});

  $scope.data = {};
  $scope.data.sections = StudentClasses.query({id: $routeParams.id});
});