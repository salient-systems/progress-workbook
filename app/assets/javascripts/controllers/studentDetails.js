// student details page
app.controller('StudentCtrl', function($scope, $routeParams, Restangular, $location, graphConfig) {
  $scope.graphConfig = graphConfig;

  var student = Restangular.one('students', $routeParams.id);
  student.get().then(function(thestudent) {
    $scope.student = thestudent;
    $scope.setupEditStudent();
  });

  $scope.selections = [];

  Restangular.all('terms').getList().then(function(theterms) {
    $scope.terms = theterms;
    $scope.termId = $scope.terms.length;
    student.all('sections').getList({term_id: theterms.length}).then(function(sections) {
      $scope.sections = sections;
    });
  });

  $scope.updateTerm = function() {
  	student.all('sections').getList({term_id: $scope.termId}).then(function(sections) {
      $scope.sections = sections;
    });
    graphConfig.updateTerm($scope.termId);
  };

  $scope.save = function() {
    $scope.student.fname = $scope.editStudent.fname;
    $scope.student.lname = $scope.editStudent.lname;
    $scope.student.sid = $scope.editStudent.sid;
    $scope.student.grade_level = $scope.editStudent.grade_level;
    $scope.student.gender = $scope.editStudent.gender;
    if($scope.editStudent.gender == "")
    {
      $scope.student.gender = null;
    }
    $scope.student.is_active = $scope.editStudent.is_active;
    $scope.student.put();
    $scope.displayGender();
    $('#editStudentModal').modal('hide');
  };

  $scope.displayGender = function() {
    if($scope.student.gender == 'm') {
      $scope.gender = "Male";
    }
    else if ($scope.student.gender == 'f'){
      $scope.gender = "Female";
    }
    else if ($scope.student.gender == null){
      $scope.gender = "Unknown";
    }
  };

  $scope.setupEditStudent = function() {
    $scope.editStudent = {
      fname: $scope.student.fname,
      lname: $scope.student.lname,
      sid: parseInt($scope.student.sid),
      grade_level: $scope.student.grade_level,
      gender: $scope.student.gender,
      is_active: $scope.student.is_active
    };
    $scope.displayGender();
  };

  $scope.resetValidation = function() {
    $scope.setupEditStudent();
    $scope.validateFName = false;
    $scope.validateLName = false;
    $scope.validateSid = false;
    $scope.validateGrade = false;
  };

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
      }
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

  $scope.compare = function() {
    var datasets = [];

    _.each($scope.selections, function(section, i) {
      datasets[i] = {
        filterType: 'students',
        filterDatum: {id: $scope.student.id, value: $scope.student.fname + ' ' + $scope.student.lname},
        termId: section.term.id,
        sectionId: section.id,
        assessmentTypeId: undefined,
        assessmentId: undefined,
        criterionId: undefined,
        statisticId: 2
      };
    });

    $location.path('/performance').search({datasets: encodeURIComponent(JSON.stringify(datasets))});
  };
});