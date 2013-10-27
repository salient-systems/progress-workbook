// cohort details page
app.controller('CohortCtrl',
function($scope, $routeParams, Restangular) {
  var cohort = Restangular.one('cohorts', $routeParams.id);
  $scope.cohort = cohort.get();
  $scope.students = cohort.getList('students');
});