// section details
app.controller('ClassCtrl', ['$scope', '$routeParams', 'Students', 'ClassStudents',
  function($scope, $routeParams, Students, ClassStudents) {
    $scope.data = {};

    $scope.data.students = ClassStudents.query({id: $routeParams.id});
  }]);