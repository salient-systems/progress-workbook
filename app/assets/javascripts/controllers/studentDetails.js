// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Restangular) {
  var student = Restangular.one('students', $routeParams.id);
  student.get().then(function(thestudent) {
    $scope.student = thestudent;
    $scope.editStudent = angular.copy(thestudent);
  });

  $scope.sections = student.getList('sections');

  $scope.save = function() {
    $scope.student.put();
  };
});