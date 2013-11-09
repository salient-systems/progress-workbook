// student list
app.controller('SettingsCtrl', function($scope, $rootScope, Restangular) {
  if ($rootScope.students === undefined) {
    Restangular.all('students').getList().then(function(students) {
      $rootScope.students = students;
      $scope.students = $rootScope.students;
    });
  } else {
    $scope.students = $rootScope.students;
  }

  $scope.checked_students = [];
  $scope.mySelections = [];

  $scope.save = function() {
    //console.log(row.entity);
    //console.log(column.field);
    //console.log('Cell Value prior: ' + row.entity[column.field]);
    //console.log('Cell Value after: ' + cellValue);
    this.row.entity.put();
  };


app.controller('AddTerm', function($scope, Restangular) {
  $scope.saveTerm = function() {
    var newStudent = angular.copy($scope.newStudent);
    newStudent.is_active = true; // TODO make is_active default to true in the DB
    Restangular.all('students').post(newStudent).then(function(response) {
      $scope.students.push(response);
    });
    $scope.newStudent = null; // reset the form
    $('#addStudentModal').modal('hide');
    $scope.resetTermValidation();
  };

  $scope.resetTermValidation = function() {
    $scope.newName = null;
  };
});

app.controller('AddSubject', function($scope, Restangular) {
  $scope.saveSubject = function() {
    var newStudent = angular.copy($scope.newStudent);
    newStudent.is_active = true; // TODO make is_active default to true in the DB
    Restangular.all('students').post(newStudent).then(function(response) {
      $scope.students.push(response);
    });
    $scope.newStudent = null; // reset the form
    $('#addStudentModal').modal('hide');
    $scope.resetSubjectValidation();
  };

  $scope.resetSubjectValidation = function() {
    $scope.newStudent = null;
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateSid = false;
    $scope.validateGrade = false;
  };
});
