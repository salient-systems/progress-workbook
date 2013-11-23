// cohort details page
app.controller('CohortCtrl',
function($scope, $routeParams, Restangular) {
  var cohort = Restangular.one('cohorts', $routeParams.id);
  cohort.get().then(function(cohort) {
    $scope.cohort = cohort;
  });

  cohort.getList('students').then(function(students) {
    $scope.students = students;
  });

  cohort.getList('students').then(function(sections) {
    $scope.sections = sections;
  });

  cohort.get().then(function(thecohort) {
    $scope.cohort = thecohort;
    $scope.setupEditCohort();
  });

  $scope.save = function() {
    $scope.cohort.name = $scope.editCohort.name;
    $scope.cohort.put();
    $('#editCohortModal').modal('hide');
  };

  $scope.setupEditCohort = function() {
    $scope.editCohort = {
      name: $scope.cohort.name
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditCohort();
    $scope.validateName = false;
  };

  $scope.selections = [];
  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.selections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['lname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'lname',
        displayName:'Last Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'fname',
        displayName:'First Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'sid',
        displayName: 'Student ID'
      },{
        field: 'grade_level',
        displayName: 'Grade Level'
      }/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ]
  };

  $scope.removeFromCohort = function() { //TODO: Finish implementing after updating Rails
    _.each($scope.selections, function(student, key) {
      cohort_student = Restangular.one('cohort_students').get({"cohort_id": $routeParams.id, "student_id": student.id}).then(function(thereturn){
      	Restangular.one('cohort_students',thereturn[0].id).remove();
      	$scope.students = _.without($scope.students, student);
      });
    });

    $scope.gridOptions.$gridScope.toggleSelectAll(null, false);
  };

    // add student typeahead
  $('input#studentSearch').typeahead({
    name: 'students',
    prefetch: {
      url: '/students/search.json',
      ttl: 0
    }
  });

  $('span#inClass').hide();
  $('span#addSuccess').hide();
  $('.tt-query').css('background-color','#fff');

  $('input#studentSearch').bind('typeahead:selected', function(obj, datum, name) {
    var studentId = datum.id;

    var inCohort = _.find($scope.students, function(student) {
      return student.id == studentId;
    });

    if (inCohort === undefined) {
      Restangular.one('students', studentId).get().then(function(student) {
        $scope.students.push(student);
        $('span#addSuccess').fadeIn(500).delay(1500).fadeOut(500);
      });
      Restangular.all('cohort_students').post({
        student_id: studentId,
        cohort_id: $routeParams.id
      });
    } else {
      $('span#inClass').fadeIn(500).delay(2000).fadeOut(500);
    }
  });
});