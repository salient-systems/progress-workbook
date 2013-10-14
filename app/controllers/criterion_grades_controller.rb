class CriterionGradesController < ApplicationController
  layout 'scaffold'
  before_action :set_criterion_grade, only: [:show, :edit, :update, :destroy]

  # GET /criterion_grades
  # GET /criterion_grades.json
  def index
    @criterion_grades = CriterionGrade.all
  end

  # GET /criterion_grades/1
  # GET /criterion_grades/1.json
  def show
  end

  # GET /criterion_grades/new
  def new
    @criterion_grade = CriterionGrade.new
  end

  # GET /criterion_grades/1/edit
  def edit
  end

  # POST /criterion_grades
  # POST /criterion_grades.json
  def create
    @criterion_grade = CriterionGrade.new(criterion_grade_params)

    respond_to do |format|
      if @criterion_grade.save
        format.html { redirect_to @criterion_grade, notice: 'Criterion grade was successfully created.' }
        format.json { render action: 'show', status: :created, location: @criterion_grade }
      else
        format.html { render action: 'new' }
        format.json { render json: @criterion_grade.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /criterion_grades/1
  # PATCH/PUT /criterion_grades/1.json
  def update
    respond_to do |format|
      if @criterion_grade.update(criterion_grade_params)
        format.html { redirect_to @criterion_grade, notice: 'Criterion grade was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @criterion_grade.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /criterion_grades/1
  # DELETE /criterion_grades/1.json
  def destroy
    @criterion_grade.destroy
    respond_to do |format|
      format.html { redirect_to criterion_grades_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_criterion_grade
      @criterion_grade = CriterionGrade.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def criterion_grade_params
      params.require(:criterion_grade).permit(:score, :student_id, :criterion_id, :assessment_id)
    end
end
