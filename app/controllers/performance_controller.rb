class PerformanceController < ApplicationController

  def assessmentType
    @criterion_grades = CriterionGrade
      .where(student_id: params[:sid], assessment_type_id: params[:aid])
      .includes(:criterion, :assessment)
      .order(assessment_id: :asc).all
  end

end