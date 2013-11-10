app.controller('SettingsCtrl', function($scope, Restangular) {
  $scope.savePassword = function() {
    //Restangular.all('subjects').post({name: $scope.newSubject});
    $scope.newPassword = null; // reset the form
  };

  $scope.saveTerm = function() {
    Restangular.all('terms').post({name: $scope.newTerm});
    $scope.newTerm = null; // reset the form
    $('#advanceTermModal').modal('hide');
    $scope.resetTermValidation();
  };

  $scope.resetTermValidation = function() {
    $scope.newTerm = null;
    $scope.confirmCheckbox = false;
    $scope.validateTermName = false;
    $scope.validateCheckbox = false;
  };

  $scope.saveSubject = function() {
    Restangular.all('subjects').post({name: $scope.newSubject});
    $scope.newSubject = null; // reset the form
    $('#addSubjectModal').modal('hide');
    $scope.resetSubjectValidation();
  };

  $scope.resetSubjectValidation = function() {
    $scope.newSubject = null;
    $scope.validateSubjectName = false;
  };
});