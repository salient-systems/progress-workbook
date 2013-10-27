// section details
app.controller('ClassCtrl',
function($scope, $routeParams, Restangular) {
  var section = Restangular.one('sections', $routeParams.id);
  $scope.students = section.getList('students');
  $scope.assessment_types = section.getList('assessment_types');
});