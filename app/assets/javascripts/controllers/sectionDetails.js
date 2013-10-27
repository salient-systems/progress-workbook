// section details
app.controller('ClassCtrl',
function($scope, $routeParams, Students, ClassStudents, ClassAssessments) {
  $scope.data = {};

  $scope.data.students = ClassStudents.query({id: $routeParams.id});
  $scope.data.assessment_types = ClassAssessments.query({id: $routeParams.id});
});