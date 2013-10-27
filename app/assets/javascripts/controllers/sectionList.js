// Class list
app.controller('ClassListCtrl', ['$scope', 'Sections',
  function($scope, Sections) {
    $scope.data = {};

    Sections.query(function(response) {
      $scope.data.sections = response;
      console.log($scope.data.sections);
    });
  }]);