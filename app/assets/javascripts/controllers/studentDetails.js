// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Restangular) {
  var student = Restangular.one('students', $routeParams.id);
  student.get().then(function(thestudent) {
    $scope.student = thestudent;
    $scope.setupEditStudent();
  });

  student.getList('sections').then(function(sections) {
    $scope.sections = sections;
  });
  $scope.selections = [];

  $scope.save = function() {
    $scope.student.fname = $scope.editStudent.fname;
    $scope.student.lname = $scope.editStudent.lname;
    $scope.student.sid = $scope.editStudent.sid;
    $scope.student.grade_level = $scope.editStudent.grade_level;
    $scope.student.gender = $scope.editStudent.gender;
    $scope.student.put();
    $scope.updateGender();
    $('#editStudentModal').modal('hide');
  };

  $scope.updateGender = function() {
    if($scope.student.gender == 'm') {
      $scope.gender = "Male";
    }
    else if ($scope.student.gender == 'f'){
      $scope.gender = "Female";
    }
    else if ($scope.student.gender == NUL){
      $scope.gender == "Unknown";
    }
  };

  $scope.setupEditStudent = function() {
    $scope.editStudent = {
      fname: $scope.student.fname,
      lname: $scope.student.lname,
      sid: $scope.student.sid,
      grade_level: $scope.student.grade_level,
      gender: $scope.student.gender
    };
    $scope.updateGender();
  };

  $scope.resetValidation = function() {
    $scope.setupEditStudent();
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateSid = false;
    $scope.validateGrade = false;
  };

  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'sections',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['period'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'name',
        displayName:'Title',
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>',
        enableCellEdit: false,
        width: '40%'
      }, {
        field: 'subject.name',
        displayName:'Subject',
        enableCellEdit: false,
        width: '20%'
      }, {
        field: 'period',
        displayName: 'Period'
      },{
        field: 'user.fname',
        displayName: 'Teacher',
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/users/{{row.getProperty(\'id\')}}">{{row.getProperty(\'user.fname\')}} {{row.getProperty(\'user.lname\')}}</a></div>',
        width: '30%'
      },/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ]
  };

  $scope.removeClass = function() { //TODO: Finish implementing after updating Rails
    _.each($scope.selections, function(student, key) {
      Restangular.one('students', students.id).remove().then(function() {
        $scope.students = _.without($scope.students, student);
      });
    });
    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

});