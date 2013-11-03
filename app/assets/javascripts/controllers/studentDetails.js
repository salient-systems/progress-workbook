// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Restangular) {
  var student = Restangular.one('students', $routeParams.id);
  student.get().then(function(thestudent) {
    $scope.student = thestudent;
    $scope.editStudent = {
      fname: thestudent.fname,
      lname: thestudent.lname,
      sid: thestudent.sid,
      grade_level: thestudent.grade_level,
      gender: thestudent.gender
    };
  });

  $scope.sections = student.getList('sections');

  $scope.save = function() {
    $scope.student.fname = $scope.editStudent.fname;
    $scope.student.lname = $scope.editStudent.lname;
    $scope.student.sid = $scope.editStudent.sid;
    $scope.student.grade_level = $scope.editStudent.grade_level;
    $scope.student.gender = $scope.editStudent.gender;
    $scope.student.put();
    $('#editStudentModal').modal('hide');
  };
});