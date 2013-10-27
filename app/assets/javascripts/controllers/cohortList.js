// cohort list
app.controller('CohortListCtrl', ['$scope', 'Cohorts',
  function($scope, Cohorts) {
    $scope.data = {};

    Cohorts.query(function(response) {
      $scope.data.cohorts = response;
    });
  }]);