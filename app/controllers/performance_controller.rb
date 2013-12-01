class PerformanceController < ApplicationController

  def section
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade)
      .all
  end

  def student
    if params[:aid] != nil
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_id: params[:aid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc).all
    else
      @criterion_grades = CriterionGrade
        .where(student_id: params[:sid], assessment_type_id: params[:atid])
        .includes(:criterion, :assessment)
        .order(assessment_id: :asc).all
    end
  end
end


