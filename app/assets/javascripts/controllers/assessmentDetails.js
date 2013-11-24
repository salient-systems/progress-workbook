// user details page
app.controller('AssessmentCtrl', function($scope, $routeParams, Restangular) {
  
  var assessment_type = Restangular.one('assessment_types', $routeParams.assessment_type_id);
  var section = Restangular.one('sections', $routeParams.section_id);
  
  $scope.view1 = false;
  $scope.view1 = false;
  $scope.view1 = false;
  
  if($routeParams.view_id == 1){
  	$scope.view1 = true;
  }
  
  if($routeParams.view_id == 2){
  	$scope.view2 = true;
  }
  
  if($routeParams.view_id == 3){
  	$scope.view3 = true;
  }
  
  $scope.assessment_type = assessment_type.get();
  
  section.get().then(function(thesection) {
    $scope.section = thesection;
  });
  
  assessment_type.getList('assessments').then(function(thereturn){
  	console.log(thereturn);
  	$scope.assessments = thereturn;
  });

  var myHeaderCellTemplate =   '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
                               '<div style="word-wrap: break-word;" ng-click="col.sort($event)" ng-class="colt + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
                               '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
                               '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
                               '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
                               '</div>'+
                               '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

  var editTemplate2 = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="saveGrade(col.index)" />';
  var editTemplate = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="saveGrade(col.index)" ng-focus="backupGrade(col.index)" />';
  var headerrow = '<div style="writing-mode: tb-rl">Hello</div>';
  var vcellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/students/{{row.getProperty(\'id\')}}">{{row.getProperty(\'fname\')}} {{row.getProperty(\'lname\')}}</a></div>';
  
  Restangular.all('criterions').getList({assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
  	$scope.criterions = thereturn;
  	//$scope.modalCriterions = [angular.copy(thereturn)];
	Restangular.all('studentassessments').getList({section_id: $routeParams.section_id, assessment_type_id: $routeParams.assessment_type_id}).then(function(thereturn){
	  $scope.students = thereturn;
	   
       $scope.myDefs2 = [];
       var myobj = {};
       myobj.field = 'fname';
       myobj.displayName = 'Name';
       myobj.cellTemplate = vcellTemplate;
       myobj.enableCellEdit = false;
       myobj.resizable = true;
       myobj.width = '15%';
       
       $scope.myDefs2[0] = myobj;
       //console.log($scope.myDefs2);

	  for(var i = 0; i < $scope.criterions.length; i++){
	  	 
	    var myobj2 = {};
	    myobj2.field = "scores["+i+"].score";
        myobj2.displayName = $scope.criterions[i].name;
        myobj2.editableCellTemplate = editTemplate;
        myobj2.enableCellEdit = true;
        myobj2.resizable = true;
        myobj2.headerCellTemplate = myHeaderCellTemplate;
        myobj2.width = '35px';
        $scope.myDefs2[i+1] = myobj2;
	  };
	  
	});
  });
  
  
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
  
  $scope.saveGrade = function(index) {
  	if (this.row.entity.scores[index-1].score != $scope.gradeBackup){
  	  var editable = Restangular.copy(this.row.entity.scores[index-1]);
  	  editable.route = "criterion_grades";
  	  editable.put();
  	}
  };
	
  $scope.backupGrade = function(index) {
  	$scope.gradeBackup = this.row.entity.scores[index-1].score;
  };	
	
  $scope.checkVal = function(criterion) {
  	console.log(criterion);
  };	
  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  console.log($scope.myDefs2);

  $scope.gridOptions = {
    data: 'students',
    selectedItems: $scope.mySelections,
    multiSelect: true,
    showSelectionCheckbox: false,
    selectWithCheckboxOnly: true,
    enableCellSelection: true,
    enableCellEditOnFocus: true,
    enableRowSelection: false,
    enableCellEdit: true,
    //headerRowHeight: 200,
    sortInfo: {fields:['fname'], directions:['asc']},
    filterOptions: { filterText: '', useExternalFilter: false },
    columnDefs: 'myDefs2' ,
  
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      //saveGrade(col.index);
      console.log(col.index);
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };
	
});

//controller for the modal that edits the assessment info for an assessment type
app.controller('EditRunChartCtrl', function($scope, $routeParams, Restangular){
  $scope.setupEditCriterion = function() {
    $scope.editCriterion = {
      name: $scope.user.fname,
      max: $scope.user.lname,
    };
    $scope.updateRole();
  };
  
  $scope.newCriterion = function(i) {
    var newCriterion = {
      max: 0,
      name: false,
      assessment_id: $scope.assessment_type.
    };
    newPanel.id = $scope.panels.valueOf().length + 1;
    $scope.panels.push(newPanel);
  };
  
  
});