/*
 * Master Performance Controller
 *
 */
app.controller('PerformanceCtrl', function($scope, $routeParams, Restangular, $http, $timeout, $location) {

  $scope.panelIndex = 0;
  $scope.noDelete = true;

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
    filterType: "",
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
    },

    /*
     * Update statistic
     */
    updateStatistic: function() {
      // TODO do the math for the current statistic
    }
  };

  /* ----------------------- Save/Dupe/Remove Panels ----------------------- */

  $scope.save = function(isLast, panel) {
    // TODO get the performance data!

    // create new dataset if we're saving the last dataset
    if (isLast) {
      $scope.createPanel($scope.defaultPanel);
    }
  };

  $scope.duplicate = function(panel) {
    $scope.createPanel(panel);
  };

  $scope.createPanel = function(panel) {
    var newPanel = angular.copy(panel);
    newPanel.id = ++$scope.panelIndex;
    $scope.panels.push(newPanel);
    $timeout(function() { angular.bind(newPanel, newPanel.setupSearch)(); }, 0);
    $scope.noDelete = false;
    $scope.scrollToBottom();
  };

  $scope.remove = function(panelIndex, isLast) {
    $scope.panels.splice(panelIndex, 1);
    $scope.noDelete = isLast;
  };

  $scope.scrollToBottom = function() {
    $('html, body').animate({scrollTop:$(document).height()}, 1500);
  };

  /* --------------------------- Start the party! -------------------------- */

  // insert the default first panel
  $scope.panels = [angular.copy($scope.defaultPanel)];

  // prefetch the twitter typeahead datums
  $http.get('/performance/search.json').success(function(datums) {
    $scope.searchDatums = datums;
    // now we have datums, so setup the typeahead for the default panel
    angular.bind($scope.panels[0], $scope.panels[0].setupSearch)();
  });

  // prefetch the latest term and and its sections
  Restangular.all('terms').getList().then(function(terms) {
    $scope.terms = terms;
    $scope.panels[0].termId = $scope.terms.length;
    $scope.defaultPanel.termId = $scope.terms.length;


    $scope.parseUrl();


    Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
      $scope.panels[0].sections = sections;
      $scope.defaultPanel.sections = sections;
    });
  });


  // parse URL and configure data sets (if applicable)
  $scope.parseUrl = function() {
    $scope.location = $location;
    var urlParam = ($location.search());
    $scope.$watch('location.search()', function() {
      var panel = $scope.panels[0];

      if(urlParam.term != undefined) {
        panel.termId = parseInt(urlParam.term);

        if(urlParam.section != undefined) {
          panel.sectionId = parseInt(urlParam.section);
          Restangular.one('sections', panel.sectionId).getList('assessment_types').then(function(assessmenttypes) {
            panel.assessmentTypes = assessmenttypes;
          });

          if(urlParam.assessmentType != undefined) {
            panel.assessmentTypeId = parseInt(urlParam.assessmentType);
            Restangular.one('assessment_types', panel.assessmentTypeId).getList('assessments').then(function(assessments) {
              panel.assessments = assessments;
            });

            if(urlParam.assessment != undefined) {
              panel.assessmentId = parseInt(urlParam.assessment);
              Restangular.one('assessments', panel.assessmentId).getList('criterions').then(function(criterions) {
                panel.criterions = criterions;
              });

              if(urlParam.criterion != undefined) {
                panel.criterionId = parseInt(urlParam.criterion);
              }
            }
          }
        }

        if(urlParam.statistic != undefined) {
          panel.statisticId = parseInt(urlParam.statistic);
        }
      }
    }, true);
  };

});

/*
 * Chart Controller
 *
 */
app.controller('ChartCtrl', function($scope, $http){
  //color : #F26C4F, #FBAF5C, #FFF467, #00BFF3, #3BB878, #438CCA, #A763A8, #F06EA9, #998675, #754C24

  $http.get('/performance/student/1/assessment_type/1').success(function(response) {

    var data = _.pluck(response, 'dataPoint');
    var options = {
      lines: {
        show: true
      },
      points: {
        show: true
      },
      xaxis: {
        mode: "categories"
      },
      yaxis: {
        max: response[0].max
      }
    };

    $.plot($("#perfGraph"), [ { label: 'Dataset 1', data: data } ], options);
  });
});