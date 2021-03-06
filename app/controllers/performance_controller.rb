class PerformanceController < ApplicationController

  ##############################
  ##### section statistics #####
  ##############################

  # get all assessments that belong to an assessment type
  def sectionAssessType

=begin
    logger.warn "*** BEGIN RAW REQUEST HEADERS ***"
    self.request.env.each do |header|
      logger.warn "HEADER KEY: #{header[0]}"
      logger.warn "HEADER VAL: #{header[1]}"
    end
    logger.warn "*** END RAW REQUEST HEADERS ***"
=end

    puts request.headers['HTTP_AUTHTOKEN']

    @numStudents = Section.find(params[:sid]).students.count
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade)
      .all
     render :template => 'performance/assessment'
  end


  # get one assessment
  def sectionAssessment
    @numStudents = Section.find(params[:sid]).students.count
    @assessments = Assessment
      .where(id: params[:aid])
      .includes(:criterions, :criterion_grade)
      .all
     render :template => 'performance/assessment'
  end

  ##############################
  ##### student statistics #####
  ##############################

  def studentAssessType
    @numStudents = 1
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade).where('criterion_grades.student_id' => params[:sid]).references(:criterion_grade)
      .all
    render :template => 'performance/assessment'
  end

  def studentAssessment
    @numStudents = 1
    @assessments = Assessment
      .where(id: params[:aid])
      .includes(:criterions, :criterion_grade).where('criterion_grades.student_id' => params[:sid]).references(:criterion_grade)
      .all
    render :template => 'performance/assessment'
  end

  ##############################
  ##### cohort statistics  #####
  ##############################

  def cohortAssessType
    @studentIds = Cohort.find(params[:cid]).students.map(&:id)
    @numStudents = @studentIds.size
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade).where('criterion_grades.student_id' => @studentIds).references(:criterion_grade)
      .all
    render :template => 'performance/assessment'
  end

  def cohortAssessment
    @studentIds = Cohort.find(params[:cid]).students.map(&:id)
    @numStudents = @studentIds.size
    @assessments = Assessment
      .where(id: params[:aid])
      .includes(:criterions, :criterion_grade).where('criterion_grades.student_id' => @studentIds).references(:criterion_grade)
      .all
    render :template => 'performance/assessment'
  end

end