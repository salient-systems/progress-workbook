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
  $scope.graphOptions = {};

  $scope.defaultLineGraphOptions = {
    series: {
      lines: { show: true },
      points: { show: true }
    },
    xaxis: {
      mode: 'categories'
    },
    yaxis: {
      min: 0
    }
  };

  $scope.defaultBarGraphOptions = {
    series: {
      bars: {
        show: true,
        barWidth: 0.6,
        align: 'center'
      }
    },
    xaxis: {
      mode: 'categories',
      tickLength: 0
    },
    yaxis: {
      min: 0
    }
  };

  /*
   * Availables stats for each graph type
   */
  $scope.sectionStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" }
  ];

  $scope.assessmentTypeStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 5, name: "Percent of Term" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
    { id: 8, name: "Students Present" }
  ];

  $scope.assessmentStatistics = [
    { id: 1, name: "Total Correct" },
    { id: 2, name: "Percentage Correct" },
    { id: 3, name: "Total Possible" },
    { id: 4, name: "Total Goal" },
    { id: 6, name: "Score Distribution (Total)" },
    { id: 7, name: "Score Distribution (Percent)" },
  ];

  $scope.criterionStatistics = [
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
	  assessmentLabel: 'Assessment',
	  criterionLabel: 'Criterion',

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
        self.updateTerm(self.filterType == 'cohorts');
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
        this.updateTerm(false);
      }
    },

    /*
     * Update sections when term changes
     */
    updateTerm: function(cohortSelected) {
      var self = this;
      self.sectionId = null;
      self.assessmentTypeId = null;
      self.assessmentId = null;
      self.criterionId = null;
      self.assessmentTypes = [];
      self.assessments = [];
      self.criterion = [];

      if (self.filterType == 'users' || self.filterType == 'students') {
        // if a student or user has been selected, only show their sections
        var userOrStudent = Restangular.one(self.filterType, self.filterDatum.id);
        userOrStudent.all('sections').getList({term_id: self.termId}).then(function(sections) {
            self.sections = sections;
        });
      } else if (!cohortSelected) { // don't fetch sections if cohort is selected in typeahead
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
        Restangular.one('sections', self.sectionId).getList('assessment_types')
        .then(function(assessmenttypes) {
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

        var atype = _.findWhere(self.assessmentTypes, {id: self.assessmentTypeId});
        if (atype.view == 3) {
          self.assessmentLabel = 'Unit';
          self.criterionLabel = 'Standard';
        }
        else {
          self.assessmentLabel = 'Assessment';
          self.criterionLabel = 'Criterion';
        }
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


  /* ----------------------- Panel Management ----------------------- */

  $scope.save = function(dataset) {
    $scope.updateURL();
    $scope.plot(dataset, dataset);
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
    $scope.updateURL();
    $scope.allGraphPoints.splice(panelIndex, 1);
    $.plot("#graph", $scope.allGraphPoints, $scope.graphOptions);
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

  /*
   * Parse URL and configure data sets (if applicable)
   */
  $scope.parseUrl = function() {
    //retrieve student/teacher/cohort ID
    var datasets = $.parseJSON(decodeURIComponent($location.search().datasets));

    angular.forEach(datasets, function(dataset, index) {
      var panel = $scope.addPanel();
      $scope.plot(dataset, panel);

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

          if (dataset.assessmentTypeId != undefined) {
            panel.statistics = $scope.assessmentTypeStatistics;
            panel.assessmentTypeId = dataset.assessmentTypeId;

            Restangular.one('assessment_types', panel.assessmentTypeId).getList('assessments').then(function(assessments) {
              panel.assessments = assessments;
            });

            var atype = _.findWhere(panel.assessmentTypes, {id: dataset.assessmentTypeId});
            if (atype.view == 3) {
              panel.assessmentLabel = 'Unit';
              panel.criterionLabel = 'Standard';
            }
            else {
              panel.assessmentLabel = 'Assessment';
              panel.criterionLabel = 'Criterion';
            }

            if (dataset.assessmentId != undefined) {
              panel.statistics = $scope.assessmentStatistics;
              panel.assessmentId = dataset.assessmentId;

              Restangular.one('assessments', panel.assessmentId).getList('criterions').then(function(criterions) {
                panel.criterions = criterions;
              });

              if (dataset.criterionId != undefined) {
                panel.statistics = $scope.criterionStatistics;
                panel.criterionId = dataset.criterionId;
              }
            }
          }

        });
      }
    });
  };


  /* ----------------------------- Graphs  --------------------------------- */

   /*
    * Chooses the url for fetching graph data
    */
   $scope.buildRequestUrl = function(dataset) {
    var url = '';

    if (dataset.filterType == 'students') {
      url += 'students/' + dataset.filterDatum.id;
    } else if (dataset.filterType == 'cohorts') {
      url += 'cohorts/' + dataset.filterDatum.id;
    } else {
      url += 'sections/' + dataset.sectionId;
    }

    if (dataset.criterionId || dataset.assessmentId) {
      url += '/assessment/' + dataset.assessmentId;
    } else if (dataset.assessmentTypeId) {
      url += '/assesstype/' + dataset.assessmentTypeId;
    } else if (dataset.sectionId) {
      // TODO get all data about all assessments
    }

    return url;
  };

  /*
   * Determines the graph type and delegates to appropriate method
   */
  $scope.plot = function(dataset, panel) {
    var url = $scope.buildRequestUrl(dataset);
    var series = {
      label: 'Data Set ' + parseInt(panel.id + 1),
      data: []
    };
    dataset.id = panel.id;

    Restangular.all('p').customGETLIST(url).then(function(data) {
      if (dataset.criterionId) {
        $scope.graphCriterion(dataset, data[0], series);
      } else if (dataset.assessmentId) {
        $scope.graphAssessment(dataset, data[0], series);
      } else if (dataset.assessmentTypeId) {
        $scope.graphAssessmentTypeOverall(dataset, data, series);
      }

      if (panel.graphPointsIndex != null) {
        $scope.allGraphPoints[dataset.graphPointsIndex] = series;
      } else {
        panel.graphPointsIndex = $scope.allGraphPoints.push(series) - 1;
      }

      // draw the graph
      $.plot("#graph", $scope.allGraphPoints, $scope.graphOptions);
    });
  };

  /*
   * Calculate percent/total distributions for one criterion
   */
  $scope.graphCriterion = function(dataset, assessment, series) {
    var distribution = $scope.getCriterionScoreDistribution(dataset.criterionId, assessment.grades);
    $scope.graphOptions = angular.copy($scope.defaultBarGraphOptions);

    // TODO fix buggy multiple bars
    series.bars = {
      show: true,
      barWidth: 0.3,
      order: dataset.id + 1
    };

    if (dataset.statisticId == 6) {
      _.each(distribution, function(numScores, score) {
        series.data.push([score, numScores]);
      });
      $scope.graphOptions.yaxis.tickSize = 1;
    } else if (dataset.statisticId == 7) {
      _.each(distribution, function(numScores, score) {
        series.data.push([score, (numScores/assessment.numStudents) * 100]);
      });
      $scope.graphOptions.yaxis.tickSize = 10;
      $scope.graphOptions.yaxis.max = 100;
    }
  };

  /*
   * Statistics for a single assessment
   */
  $scope.graphAssessment = function(dataset, assessment, series) {
    $scope.graphOptions = angular.copy($scope.defaultBarGraphOptions);

    // total and percentage correct
    if (dataset.statisticId == 1 || dataset.statisticId == 2) {
      var criteria = _.groupBy(assessment.grades, 'criterion_id');

      _.each(criteria, function(criterionGrades) {
        var criterion = assessment.criteria[criterionGrades[0].criterion_id];
        var totalCorrect = $scope.sum(_.pluck(criterionGrades, 'score'));

        if (dataset.statisticId == 1) {
          // total correct
          series.data.push([criterion.name, totalCorrect]);
        } else if (dataset.statisticId == 2) {
          // percentage correct
          var numStudents = $scope.getStudentsPresent(assessment);
          var totalPossible = numStudents * criterion.max;
          series.data.push([criterion.name, (totalCorrect / totalPossible) * 100]);

          $scope.graphOptions.yaxis.tickSize = 10;
          $scope.graphOptions.yaxis.max = 100;
        }
      });
    }

    // total possible and total goal
    if (dataset.statisticId == 3 || dataset.statisticId == 4) {
      var criteria = _.groupBy(assessment.grades, 'criterion_id');

      _.each(criteria, function(criterionGrades) {
        var criterion = assessment.criteria[criterionGrades[0].criterion_id];

        if (dataset.statisticId == 4) {
          // total goal
          series.data.push([criterion.name, assessment.numStudents * criterion.max]);
        } else if (dataset.statisticId == 3) {
          // total possible
          var numStudents = $scope.getStudentsPresent(assessment);
          var totalPossible = numStudents * criterion.max;
          series.data.push([criterion.name, totalPossible]);
        }
      });
    }

    // Score distribution (percent and total)
    if (dataset.statisticId == 6 || dataset.statisticId == 7) {
      var criteriaPerStudent = _.groupBy(assessment.grades, 'student_id');
      var distribution = {};

      _.each(criteriaPerStudent, function(criteria) {
        var grade = $scope.sum(_.pluck(criteria, 'score'));

        if (distribution[grade] !== undefined) {
          distribution[grade]++;
        } else {
          distribution[grade] = 1;
        }
      });

      if (dataset.statisticId == 6) {
        // total correct
        _.each(distribution, function(numScores, score) {
          series.data.push([score, numScores]);
        });
        $scope.graphOptions.yaxis.tickSize = 1;
      } else if (dataset.statisticId == 7) {
        // percent correct
        _.each(distribution, function(numScores, score) {
          series.data.push([score, (numScores/assessment.numStudents) * 100]);
        });
        $scope.graphOptions.yaxis.tickSize = 10;
        $scope.graphOptions.yaxis.max = 100;
      }
    }
  };

  /*
   * Calculate data about all assessments of a single type
   */
  $scope.graphAssessmentTypeOverall = function(dataset, assessments, series) {
    var graphOptions = angular.copy($scope.defaultLineGraphOptions);
    var numStudents = assessments[0].numStudents;

    // total correct or percentage correct
    if (dataset.statisticId == 1 || dataset.statisticId == 2) {
      var maxList = [];
      _.each(assessments, function(assessment) {
        var thisMax = 0;
        _.each(assessment.criteria, function(criterion) {
            thisMax += criterion.max;
        });

        var grades = $scope.sum(_.pluck(assessment.grades, 'score'));

        if (dataset.statisticId == 2) {
          grades = (grades / (thisMax * numStudents)) * 100;
        }

        series.data.push([assessment.name, grades]);
        maxList.push(thisMax);
      });

      if (dataset.statisticId == 1) {
        graphOptions.yaxis.max = _.max(maxList) * numStudents;
      } else {
        graphOptions.yaxis.max = 100;
        graphOptions.yaxis.tickSize = 10;
      }
    }

    // total possible and total goal
    if (dataset.statisticId == 3 || dataset.statisticId == 4) {
      _.each(assessments, function(assessment) {
        var max = $scope.sum(_.pluck(assessment.criteria, 'max'));
        if (dataset.statisticId == 3) {
          // total possible
          var studentsPresent = $scope.getStudentsPresent(assessment);
          series.data.push([assessment.name, max * studentsPresent]);
        } else {
          // total goal
          series.data.push([assessment.name, max * numStudents]);
        }
      });
    }

    // percent of term
    if (dataset.statisticId == 5) {
      var increment = 100 / (assessments.length - 1);
      var y = 0;
      _.each(assessments, function(assessment) {
        series.data.push([assessment.name, y]);
        y += increment;
      });
      graphOptions.yaxis.max = 100;
    }

    // score distribution (percent and total)
    if (dataset.statisticId == 6 || dataset.statisticId == 7) {
      graphOptions = angular.copy($scope.defaultBarGraphOptions);
      var assessmentGrades = {};

      _.each(assessments, function(assessment) {
        var max = $scope.sum(_.pluck(assessment.criteria, 'max'));
        var criteriaPerStudent = _.groupBy(assessment.grades, 'student_id');

        _.each(criteriaPerStudent, function(criteria, studentId) {
          if (assessmentGrades[studentId] !== undefined) {
            assessmentGrades[studentId].push($scope.sum(_.pluck(criteria, 'score')) / max);
          } else {
            assessmentGrades[studentId] = [$scope.sum(_.pluck(criteria, 'score')) /  max];
          }
        });
      });

      var averagePercentGrades = _.map(assessmentGrades, function(grades) {
        return Math.floor(($scope.sum(grades) / grades.length) * 100);
      });

      console.log(averagePercentGrades);

      var distribution = {};
      _.each(averagePercentGrades, function(grade) {
        if (distribution[grade] !== undefined) {
          distribution[grade]++;
        } else {
          distribution[grade] = 1;
        }
      });

      if (dataset.statisticId == 6) {
        // total correct
        _.each(distribution, function(numScores, score) {
          series.data.push([score, numScores]);
        });
        graphOptions.yaxis.tickSize = 1;
      } else if (dataset.statisticId == 7) {
        // percent correct
        _.each(distribution, function(numScores, score) {
          series.data.push([score, (numScores/numStudents) * 100]);
        });
        graphOptions.yaxis.tickSize = 10;
        graphOptions.yaxis.max = 100;
      }

    }

    // students present
    if (dataset.statisticId == 8) {
      _.each(assessments, function(assessment) {
        series.data.push([assessment.name, $scope.getStudentsPresent(assessment)]);
      });
    }

    $scope.graphOptions = graphOptions;
  };



  /* --------------------------- Graph Helpers  ---------------------------- */

  $scope.sum = function(numbers) {
    var sum = 0;
    var i = numbers.length;
    while(i--) sum += numbers[i];
    return sum;
  };

  $scope.getTotalGoal = function(assessment) {
    var grades = assessment.grades;
    var criteria = assessment.criteria;
    var sum = 0;

    for (var i in grades) {
      sum += criteria[grades[i].criterion_id].max;
    }

    return sum;
  };

  $scope.getStudentsPresent = function(assessment) {
    return _.uniq(_.pluck(_.reject(assessment.grades, function(grade) {
        return grade.score == null;
      }), 'student_id')).length;
  };

  $scope.getCriterionScoreDistribution = function(criterionId, grades) {
    var distribution = {};

    for (var i in grades) {
      if (criterionId && grades[i].criterion_id == criterionId) {
        if (distribution[grades[i].score] !== undefined) {
          distribution[grades[i].score]++;
        } else {
          distribution[grades[i].score] = 1;
        }
      }
    }

    return distribution;
  };

  /* --------------------------- Start the party! -------------------------- */

  $q.all([
    $http.get('/performance/search.json'),
    Restangular.all('terms').getList()
  ]).then(function (response) {
    $scope.searchDatums = response[0].data;
    $scope.terms = response[1];
    $scope.defaultPanel.termId = $scope.terms.length;

    Restangular.one('terms', $scope.defaultPanel.termId).getList('sections').then(function(sections) {
      $scope.defaultPanel.sections = sections;
      if ($location.search().datasets == undefined) {
        // empty placeholder graph
        $.plot("#graph", [[]], {
          xaxis: { min: 0, max: 1 },
          yaxis: { min: 0, max: 1 }
        });
        $scope.addPanel();
      } else {
        $scope.parseUrl();
      }
    });
  });

});
