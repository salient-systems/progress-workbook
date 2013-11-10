// user details page
app.controller('AssessmentCtrl', function($scope, $routeParams, Restangular) {
  //var assessment_type = Restangular.one('assessment_types', $routeParams.assessment_type_id);
  var assessment_type = Restangular.one('assessment_types', $routeParams.assessment_type_id);
  var section = Restangular.one('sections', $routeParams.section_id);
  $scope.section = section.get();
  //var section = Restangular.one('sections', $routParams.section_id);
  
  
  $scope.students = section.getList('students');
  console.log($scope.students);
  //$scope.students.criterion = $scope.students.getList('criterions');
  //$scope.students.criterion_grade = $scope.students.getList('criterion_grades');
  //$scope.students.assessment = $scope.students.getList('assessments');
  
  /*
  section.get().then(function(thesection) {
    $scope.section = thesection;
    $scope.setupEditAssessment();
  });
  
  $scope.sections = user.getList('sections');

  $scope.save = function() {
    $scope.assessment.name = $scope.editAssessment.name;
    $scope.assessment.subject = $scope.editAssessment.subject;
    $scope.assessment.data_type = $scope.editAssessment.data_type;
    $scope.assessment.put();
    $('#editAssessmentModal').modal('hide');
  };

  $scope.setupEditAssessment = function() {
    $scope.editAssessment = {
      name: $scope.assessment.name,
      subject: $scope.assessment.subject,
      data_type: $scope.assessment.data_type
    };
  };

  $scope.resetValidation = function() {
    $scope.setupEditAssessment();
    $scope.validateName = false;
    $scope.validateSubject = false;
    $scope.validateData_Type = false;
  };
	
*/
  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: true,
    selectWithCheckboxOnly: true,
    enableCellSelection: false,
    enableCellEditOnFocus: false,
    sortInfo: {fields:['name'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: [
      {
        field: 'fname',
        displayName:'First name',
        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>',
        enableCellEdit: false,
        resizable: true
      }, {
        field: 'lname',
        displayName:'Last Name',
        enableCellEdit: false,
        resizable: true
      },{
        field: 'criterion.name',
        displayName:'Criterion Name',
        enableCellEdit: false,
        resizable: true
      }, 
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };


});