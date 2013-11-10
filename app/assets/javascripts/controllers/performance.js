// performance details page
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular) {

});

//chart controller
app.controller('ChartController', function($scope){
  var daftPoints = [[0, 4]], punkPoints = [[1, 20]];

  var data1 = [
    {
      data: daftPoints,
      color: '#00b9d7',
      bars: {show: true, barWidth:1, fillColor: '#00b9d7', order: 1, align: "center" }
    },
    {
      data: punkPoints,
      color: '#3a4452',
      bars: {show: true, barWidth:1, fillColor: '#3a4452', order: 2, align: "center" }
    }];      

  $scope.data = data1;
  
});

app.controller('accordionCtrl', function($scope){
  $scope.panels = [
  	{
      dataSetName: 'Data Set 1',
      id: 1,
      open: true,
      searchCriteria: "",
      schoolYear: "",
      className: "",
      assessmentName: "",
      dataType: ""
  	}];
  	
  //this function will add a new data field when the save button is clicked
  $scope.save = function() {
  	console.log($scope.panels.valueOf().length);
    $scope.panels.push({
    	dataSetName: "noob",
    	id: $scope.panels.valueOf().length + 1,
    	open: true,
    	searchCriteria: "",
      	schoolYear: "",
      	className: "",
      	assessmentName: "",
      	dataType: ""
    	});    
  };
});
