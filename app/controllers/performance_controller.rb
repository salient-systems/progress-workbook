class PerformanceController < ApplicationController

  ##############################
  ##### section statistics #####
  ##############################

  # get all assessments that belong to an assessment type
  def sectionAssessType
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

  # get all of a student's grades in a section
  def studentSectionOverall
    assessmentTypes = Section.find(params[:sid]).assessment_types
    @assessments = Assessment
      .where('assessment_type_id IN (?)', assessmentTypes.map(&:id))
      .includes(:criterions, :criterion_grade)
      .all
     render :template => 'performance/assessment'
  end

  # get all of a student's grades for one assessment type
  def studentAssessType
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_type_id: params[:aid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc)
        .all
      @assessment_ids = @criterion_grades.map(&:assessment_id).uniq
      render :template => 'performance/grade'
  end

  # get a student's grades for one assessment
  def studentAssessment
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_id: params[:aid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc)
        .all
      render :template => 'performance/grade'
  end

  ##############################
  ##### cohort statistics  #####
  ##############################

  def cohortAssessType
    @numStudents = params[:studentIds].size
    puts params
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade).where('criterion_grades.student_id' => params[:studentIds]).references(:criterion_grade)
      .all
    render :template => 'performance/assessment'
  end

end




