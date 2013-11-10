// section details
app.controller('SectionCtrl',
function($scope, $routeParams, Restangular) {
  var section = Restangular.one('sections', $routeParams.id);
  section.get().then(function(thesection) {
    $scope.section = thesection;
    $scope.setupEditSection();
  });
  section.getList('students').then(function(students) {
    $scope.students = students;
  });

  $scope.assessment_types = section.getList('assessment_types');
  Restangular.all('subjects').getList().then(function(thesubjects) {
    $scope.subjects = thesubjects;
  });

  $scope.save = function() {
    $scope.section.name = $scope.editSection.name;
    $scope.section.subject_id = $scope.editSection.subject_id;
    $scope.section.period = $scope.editSection.period;
    $scope.section.grade_level = $scope.editSection.grade_level;
    $scope.section.put();
    $('#editSectionModal').modal('hide');
  };

  $scope.setupEditSection = function() {
    $scope.editSection = {
      name: $scope.section.name,
      subject_id: $scope.section.subject_id,
      period: $scope.section.period,
      grade_level: $scope.section.grade_level
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditSection();
    $scope.validateName = false;
    $scope.validateSubject = false;
    $scope.validatePeriod = false;
    $scope.validateGrade = false;
  };

  var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['fname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'fname',
        displayName:'First Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'lname',
        displayName:'Last Name',
        cellTemplate: nameTemplate,
        enableCellEdit: false,
      }, {
        field: 'sid',
        displayName: 'Student ID'
      },{
        field: 'grade_level',
        displayName: 'Grade Level'
      },/*{
        displayName: 'Action', cellTemplate: '<a href="" ng-click="editUser(row.getProperty(\'id\'))"><i class="glyphicon glyphicon-pencil" />Edit</a>'
      }*/
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };
});

app.controller('AddAssessment', function($scope, Restangular) {
  $scope.saveAssessment = function() {
    var newAssessment = angular.copy($scope.newAssessment);
    newAssessment.section_id = $scope.section.id;
    Restangular.all('assessment_types').post(newAssessment).then(function(response) {
      $scope.assessment_types.push(response);
    });
    $('#createAssessmentModal').modal('hide');
    $scope.newAssessment = null; // reset the form
    $scope.resetValidation();
  };

  $scope.resetValidation = function() {
    $scope.newAssessment = null;
    $scope.validateName = false;
    $scope.validateNumAssessments = false;
    $scope.validateStyle = false;
    $scope.validateType = false;
  };
});
