app.controller('SettingsCtrl', function($scope, Restangular) {
  $scope.savePassword = function() {
    //Restangular.all('subjects').post({name: $scope.newSubject});
    $scope.newPassword = null; // reset the form
  };

  $scope.incrementGrades = function() {
  	Restangular.all('students').getList({advanceSchoolYear: 1337});
  };

  $scope.saveTerm = function() {
    Restangular.all('terms').post({name: $scope.newTerm});
    $scope.newTerm = null; // reset the form
    if($scope.incGrades) {
      $scope.incrementGrades();
    }
    $('#advanceTermModal').modal('hide');
    $scope.resetTermValidation();
  };

  $scope.resetTermValidation = function() {
    $scope.newTerm = null;
    $scope.confirmCheckbox = false;
    $scope.incGrades = false;
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

  $scope.importStudents = function() {
    //Restangular.all('subjects').post({name: $scope.newSubject}); //TODO: Finish implementing
    //$scope.newSubject = null; // reset the form
    $('#importStudentsModal').modal('hide');
    $scope.resetImportValidation();
  };

  $scope.resetImportValidation = function() {
    $scope.studentListFile = null;
    $("input:file").change(function() {
       document.getElementById('importButton').disabled = true;
     });
  };

  $(function() {
     $("input:file").change(function() {
       document.getElementById('importButton').disabled = false;
     });
  });
});