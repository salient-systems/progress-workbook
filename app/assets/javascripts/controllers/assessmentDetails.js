// assessment details
app.controller('AssessmentCtrl',
function($scope, $routeParams, Restangular) {
  var section = Restangular.one('sections', $routeParams.sectionid);
  $scope.section = section.get();
  $scope.students = section.getList('students');
  $scope.assessment_types = section.getList('assessment_types');
});