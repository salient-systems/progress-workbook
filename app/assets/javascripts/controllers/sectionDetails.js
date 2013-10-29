// section details
app.controller('ClassCtrl',
function($scope, $routeParams, Restangular) {
  var section = Restangular.one('sections', $routeParams.id);
  $scope.section = section.get();
  $scope.students = section.getList('students');
  //$scope.subjects = section.getList('subjects');
  $scope.assessment_types = section.getList('assessment_types');
});