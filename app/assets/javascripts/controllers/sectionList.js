// Class list
app.controller('ClassListCtrl', function($scope, Sections, Restangular) {
  console.log(Restangular);

  $scope.data = {};

  Sections.query(function(response) {
    $scope.data.sections = response;
    console.log($scope.data.sections);
  });
});