class PerformanceController < ApplicationController

  def assessmentType
    @assessments = Assessment
      .where(assessment_type_id: params[:aid])
      .includes(:criterions, :criterion_grade)
      .all
  end

=begin
  def assessmentType2
    @criterion_grades = CriterionGrade
      .where(student_id: params[:sid], assessment_type_id: params[:aid])
      .includes(:criterion, :assessment)
      .order(assessment_id: :asc).all
  end
=end

end


