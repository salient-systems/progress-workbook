// cohort list
app.controller('CohortListCtrl', function($scope, Restangular) {
  $scope.cohorts = Restangular.all('cohorts').getList();
});