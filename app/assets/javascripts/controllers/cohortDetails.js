// cohort details page
app.controller('CohortCtrl',
function($scope, $routeParams, Cohorts, CohortStudents) {
  $scope.cohort = Cohorts.get({id: $routeParams.id});

  $scope.data = {};
  $scope.data.students = CohortStudents.query({id: $routeParams.id});
});