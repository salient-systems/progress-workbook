// cohort list
app.controller('CohortListCtrl', function($scope, Cohorts) {
  $scope.data = {};

  Cohorts.query(function(response) {
    $scope.data.cohorts = response;
  });
});