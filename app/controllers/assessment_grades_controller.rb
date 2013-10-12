class AssessmentGradesController < ApplicationController
  before_action :set_assessment_grade, only: [:show, :edit, :update, :destroy]

  # GET /assessment_grades
  # GET /assessment_grades.json
  def index
    @assessment_grades = AssessmentGrade.all
  end

  # GET /assessment_grades/1
  # GET /assessment_grades/1.json
  def show
  end

  # GET /assessment_grades/new
  def new
    @assessment_grade = AssessmentGrade.new
  end

  # GET /assessment_grades/1/edit
  def edit
  end

  # POST /assessment_grades
  # POST /assessment_grades.json
  def create
    @assessment_grade = AssessmentGrade.new(assessment_grade_params)

    respond_to do |format|
      if @assessment_grade.save
        format.html { redirect_to @assessment_grade, notice: 'Assessment grade was successfully created.' }
        format.json { render action: 'show', status: :created, location: @assessment_grade }
      else
        format.html { render action: 'new' }
        format.json { render json: @assessment_grade.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /assessment_grades/1
  # PATCH/PUT /assessment_grades/1.json
  def update
    respond_to do |format|
      if @assessment_grade.update(assessment_grade_params)
        format.html { redirect_to @assessment_grade, notice: 'Assessment grade was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @assessment_grade.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /assessment_grades/1
  # DELETE /assessment_grades/1.json
  def destroy
    @assessment_grade.destroy
    respond_to do |format|
      format.html { redirect_to assessment_grades_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment_grade
      @assessment_grade = AssessmentGrade.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def assessment_grade_params
      params.require(:assessment_grade).permit(:total, :assessment_id, :student_id)
    end
end
