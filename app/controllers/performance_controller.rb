class PerformanceController < ApplicationController

  # get all assessment types, assessments, and grades for a class
  def section
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade)
      .all
  end

  # get all of a student's grades for one assessment type
  def studentAssessType
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_type_id: params[:atid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc).all
  end

  # get a student's grades for one assessment
  def studentAssessment
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_id: params[:aid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc).all
  end
end


