// cohort list
app.controller('CohortListCtrl', function($scope, Restangular) {
  Restangular.all('cohorts').getList().then(function(cohorts) {
    $scope.cohorts = cohorts;
  });

  $scope.save = function() {
    var newCohort = angular.copy($scope.newCohort);
    Restangular.all('cohorts').post(newCohort).then(function(cohort) {
      // response from server gives us id of new cohort
      $scope.cohorts.push(cohort);
    });
    $scope.newCohort = null;
  };
});