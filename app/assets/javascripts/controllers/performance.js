/*
 * Master Performance Controller
 *
 */
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular, $http, $timeout, $location, $q) {

  $scope.allGraphPoints = [];
  $scope.panels = [];
  $scope.panelIndex = -1;
  $scope.noDelete = true;

  /*
   * Default configuration for the graph
   */
  $scope.graphOptions = {
    series: {
      lines: { show: true },
      points: { show: true }
    },
    xaxis: {
      mode: "categories"
    }
  };

  /*
   * Availables stats for each graph type
   */
  $scope.sectionStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" }
  ];

  $scope.assessmentTypeStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 5, name: "Percent of Term" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
    { id: 8, name: "Students Present" },
    { id: 9, name: "Students Enrolled" }
  ];

  $scope.assessmentStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
    { id: 8, name: "Students Present" },
    { id: 9, name: "Students Enrolled" }
  ];

  $scope.criterionStatistics = [
    //{ id: 1, name: "Total Correct" },
    //{ id: 2, name: "Percentage Correct" },
    //{ id: 3, name: "Total Possible" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
  ];

  /*
   * Dataset/Panel object
   */
  $scope.defaultPanel = {
    id: 0,
    open: true,
    searchBox: null,
    filterType: '',
    filterDatum: null,
    termId: null,
    sectionId: null,
    assessmentTypeId: null,
    assessmentId: null,
    criterionId:  null,
    statisticId: null,
    sections: [],
	  assessmentTypes: [],
	  assessments: [],
	  criterions: [],
	  statistics: $scope.sectionStatistics,
	  graphData: null,
	  graphPointsIndex: null,

	  /*
	   * Setup the dataset typeahead
	   */
	  setupSearch: function() {
	    var self = this;
	    self.searchBox = $('input#search' + self.id);

      self.searchBox.typeahead([{
        name: 'students',
        limit: 3,
        header: '<h5><img src="/assets/gradcap.png">Students</h5>',
        local: $scope.searchDatums.students,
      }, {
        name: 'cohorts',
        limit: 3,
        header: '<h5><img src="/assets/group.png">Cohorts</h5>',
        local: $scope.searchDatums.cohorts
      }, {
        name: 'users',
        limit: 3,
        header: '<h5><img src="/assets/apple.png">Users</h5>',
        local: $scope.searchDatums.users
      }]);

      $('.tt-query').css('background-color','#fff');

      // if duplicating, set the value of the search bar
      if (self.filterDatum != null) {
        self.searchBox.val(self.filterDatum.value);
      }

      // filter sections by students or users
      self.searchBox.bind('typeahead:selected', function(event, datum, name) {
        self.filterType = name; // search type is user, student, or cohort
        self.filterDatum = datum; // the id of the user, student, or cohort
        self.updateTerm();
      });

      // reset the dataset if the search box is emptied
      self.searchBox.keyup(angular.bind(self, self.checkEmpty));
    },

    /*
     * Resets the dataset when the search box is cleared
     */
    checkEmpty: function() {
      if (!this.searchBox.val()) {
        this.filterDatum = null;
        this.filterType = null;
        this.termId = $scope.terms.length;
        this.statisticId = null;
        this.statistics = $scope.sectionStatistics;
        this.updateTerm();
      }
    },

    /*
     * Update sections when term changes
     */
    updateTerm: function() {
      var self = this;
      self.sectionId = null;
      self.assessmentTypeId = null;
      self.assessmentId = null;
      self.criterionId = null;
      self.assessmentTypes = [];
      self.assessments = [];
      self.criterion = [];

      if (self.filterDatum != null) {
        // if a student or user has been selected, only show their sections
        var userOrStudent = Restangular.one(self.filterType, self.filterDatum.id);
        userOrStudent.all('sections').getList({term_id: self.termId}).then(function(sections) {
            self.sections = sections;
        });
      } else {
        Restangular.one('terms', self.termId).getList('sections').then(function(sections) {
          self.sections = sections;
        });
      }
    },

    /*
     * Update assessment types when section changes
     */
    updateSection: function() {
      var self = this;

      if (self.sectionId !== undefined) {
        Restangular.one('sections', self.sectionId).getList('assessment_types').then(function(assessmenttypes) {
          self.assessmentTypes = assessmenttypes;
        });
      }

      self.statistics = $scope.sectionStatistics;
      self.statisticId = null;
      self.assessmentTypeId = null;
      self.assessmentId = null;
      self.criterionId = null;
      self.assessmentTypes = [];
      self.assessments = [];
      self.criterion = [];
    },

    /*
     * Update assessments when assessment type changes
     */
    updateAssessmentType: function() {
      var self = this;

      if (self.assessmentTypeId !== undefined) {
        Restangular.one('assessment_types', self.assessmentTypeId).getList('assessments').then(function(assessments) {
          self.assessments = assessments;
        });

        self.statisticId = null;
        self.statistics = $scope.assessmentTypeStatistics;
      } else {
        self.statisticId = null;
        self.statistics = $scope.sectionStatistics;
      }

      self.assessmentId = null;
      self.criterionId = null;
      self.assessments = [];
      self.criterion = [];
    },

    /*
     * Update criteria when assessment changes
     */
    updateAssessment: function() {
      var self = this;

      if (self.assessmentId !== undefined) {
        Restangular.one('assessments', self.assessmentId).getList('criterions').then(function(criterions) {
          self.criterions = criterions;
        });

        self.statisticId = null;
        self.statistics = $scope.assessmentStatistics;
      } else {
        self.statisticId = null;
        self.statistics = $scope.assessmentTypeStatistics;
      }

      self.criterionId = null;
      self.criterion = [];
    },

    /*
     * Change available statistics when criterion changes
     */
    updateCriterion: function() {
      var self = this;

      if (self.criterionId !== undefined) {
        self.statisticId = null;
        self.statistics = $scope.criterionStatistics;
      } else {
        self.statisticId = null;
        self.statistics = $scope.assessmentStatistics;
      }
    }
  };

  /* ----------------------------- Graphs  --------------------------------- */

  $scope.plot = function(dataset) {

    if (dataset.filterType == 'students') {
      var url = '/p/student/'
        + dataset.studentId
        + '/type/'
        + dataset.assessmentTypeId;
    }

    if (dataset.filterType == '' || dataset.filterType == 'users') {
      var url = '/p/section/'
        + dataset.sectionId
        + '/type/'
        + dataset.assessmentTypeId;
    }

    $http.get(url).success(function(assessments) {
      var series = {
        label: 'Dataset ' + parseInt(dataset.id + 1),
        data: []
      };

      // crunch the numbers
      angular.forEach(assessments, function(assessment, index) {
        // percentage correct
        if (dataset.statisticId == 2) {
          var grades = _.pluck(assessment.grades, 'score');
          var percent = $scope.sum(grades) / $scope.getTotalPossible(assessment);
          series.data.push([assessment.name, percent]);
        }

        // total correct
        if (dataset.statisticId == 1) {
          var grades = _.pluck(assessment.grades, 'score');
          series.data.push([assessment.name, $scope.sum(grades)]);
        }
      });

      if (dataset.graphPointsIndex == null) {
        dataset.graphPointsIndex = $scope.allGraphPoints.push(series) - 1;
      } else {
        $scope.allGraphPoints[dataset.graphPointsIndex] = series;
      }

      // plot the data
      $.plot("#graph", $scope.allGraphPoints, $scope.graphOptions);
    });
  };

  $scope.sum = function(numbers) {
    var sum = 0;
    var i = numbers.length;
    while(i--) sum += numbers[i];
    return sum;
  };

  $scope.getTotalPossible = function(assessment) {
    var grades = assessment.grades;
    var criteria = assessment.criteria;
    var sum = 0;

    for (var i in grades) {
      sum += criteria[grades[i].criterion_id].max;
    }

    return sum;
  };

  $scope.getScoreDistribution = function(criterionId, grades) {
    var distribution = {};

    for (var i in grades) {
      if (grades[i].criterion_id == criterionId) {
        if (distribution[grades[i].score] !== undefined) {
          distribution[grades[i].score]++;
        } else {
          distribution[grades[i].score] = 1;
        }
      }
    }

    return distribution;
  };


  /* ----------------------- Panel Management ----------------------- */

  $scope.save = function(dataset) {
    $scope.updateURL();
    $scope.plot(dataset);
  };

  $scope.addPanel = function() {
    var newPanel = angular.copy($scope.defaultPanel);
    newPanel.id = ++$scope.panelIndex;
    $scope.panels.push(newPanel);
    $timeout(function() { angular.bind(newPanel, newPanel.setupSearch)(); }, 0);
    $scope.noDelete = ($scope.panels.length == 1); // can't delete if there's only 1 dataset
    return newPanel;
  };

  $scope.remove = function(panelIndex) {
    $scope.panels.splice(panelIndex, 1);
    $scope.allGraphPoints.splice(panelIndex, 1);
    $scope.noDelete = ($scope.panels.length == 1);
  };

  // update URL based on data set configuration
  $scope.updateURL = function() {
    var datasets = [];

    for (var i=0; i < $scope.panels.length; i++) {
      var panel = $scope.panels[i];
      datasets[i] = {
        filterType: panel.filterType,
        filterDatum: panel.filterDatum,
        termId: panel.termId,
        sectionId: panel.sectionId,
        assessmentTypeId: panel.assessmentTypeId,
        assessmentId: panel.assessmentId,
        criterionId: panel.criterionId,
        statisticId: panel.statisticId
      };
    }

    $location.search({datasets: encodeURIComponent(JSON.stringify(datasets))});
  };

  // parse URL and configure data sets (if applicable)
  $scope.parseUrl = function() {
    //retrieve student/teacher/cohort ID
    var datasets = $.parseJSON(decodeURIComponent($location.search().datasets));

    angular.forEach(datasets, function(dataset, index) {
      var panel = $scope.addPanel();
      dataset.id = panel.id;
      $scope.plot(dataset);

      if (dataset.termId != undefined) {
        panel.termId = dataset.termId;
      }

      if (dataset.filterType) {
        panel.filterType = dataset.filterType;
        panel.filterDatum = dataset.filterDatum;

        if (dataset.filterType != 'cohorts') {
          // if a student or user has been selected, only show their sections
          var userOrStudent = Restangular.one(panel.filterType, panel.filterDatum.id);
          userOrStudent.all('sections').getList({term_id: panel.termId}).then(function(sections) {
              panel.sections = sections;
          });
        }
      } else {
        Restangular.one('terms', panel.termId).getList('sections').then(function(sections) {
          panel.sections = sections;
        });
      }

      panel.statisticId = dataset.statisticId;

      if (dataset.sectionId != undefined) {
        panel.sectionId = dataset.sectionId;
        Restangular.one('sections', panel.sectionId).getList('assessment_types').then(function(assessmenttypes) {
          panel.assessmentTypes = assessmenttypes;
        });

        if (dataset.assessmentTypeId != undefined) {
          panel.assessmentTypeId = dataset.assessmentTypeId;
          Restangular.one('assessment_types', panel.assessmentTypeId).getList('assessments').then(function(assessments) {
            panel.assessments = assessments;
          });

          if (dataset.assessmentId != undefined) {
            panel.assessmentId = dataset.assessmentId;
            Restangular.one('assessments', panel.assessmentId).getList('criterions').then(function(criterions) {
              panel.criterions = criterions;
            });

            if (dataset.criterionId != undefined) {
              panel.criterionId = dataset.criterionId;
            }
          }
        }
      }


    });
  };


  /* --------------------------- Start the party! -------------------------- */

  $q.all([
    $http.get('/performance/search.json'),
    Restangular.all('terms').getList()
  ]).then(function (response) {
    $scope.searchDatums = response[0].data;
    $scope.terms = response[1];
    $scope.defaultPanel.termId = $scope.terms.length;

    if ($location.search().datasets == undefined) {
      Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
        $scope.defaultPanel.sections = sections;
        $scope.addPanel();
      });
      $.plot("#graph", [[]]); // empty placeholder graph
    } else {
      $scope.parseUrl();
    }
  });

});