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