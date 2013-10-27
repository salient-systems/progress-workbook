// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Restangular) {
  var student = Restangular.one('students', $routeParams.id);
  $scope.student = student.get();
  $scope.sections = student.getList('sections');
});