// cohort details page
controllers.controller('CohortCtrl', ['$scope', '$routeParams', 'Cohorts', 'CohortStudents',
  function($scope, $routeParams, Cohorts, CohortStudents) {
    $scope.cohort = Cohorts.get({id: $routeParams.id});

    $scope.data = {};
    $scope.data.students = CohortStudents.query({id: $routeParams.id});
  }]);