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


  //var nameTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/classes/{{row.getProperty(\'id\')}}">{{COL_FIELD}}</a></div>';
  var editTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="save()" />';

  $scope.gridOptions = {
    data: 'sections',
    selectedItems: $scope.mySelections,
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
    ],
    afterSelectionChange: function () {
      $scope.selectedIDs = [];
      angular.forEach($scope.mySelections, function ( item ) {
          $scope.selectedIDs.push(item.id);
      });
    }
  };


});