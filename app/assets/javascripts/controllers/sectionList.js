// Class list
app.controller('ClassListCtrl', function($scope, Restangular) {
  $scope.sections = Restangular.all('sections').getList();
});