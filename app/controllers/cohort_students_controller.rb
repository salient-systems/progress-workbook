class CohortStudentsController < ApplicationController
  layout 'scaffold'
  before_action :set_cohort_student, only: [:show, :edit, :update, :destroy]

  # GET /cohort_students
  # GET /cohort_students.json
  def index
    if params[:student_id] != nil and params[:cohort_id] != nil
      @cohort_students = CohortStudent.where(student_id: params[:student_id], cohort_id: params[:cohort_id])
    else
      @cohort_students = CohortStudent.all
    end
  end

  # GET /cohort_students/1
  # GET /cohort_students/1.json
  def show
  end

  # GET /cohort_students/new
  def new
    @cohort_student = CohortStudent.new
  end

  # GET /cohort_students/1/edit
  def edit
  end

  # POST /cohort_students
  # POST /cohort_students.json
  def create
    @cohort_student = CohortStudent.new(cohort_student_params)

    respond_to do |format|
      if @cohort_student.save
        format.html { redirect_to @cohort_student, notice: 'Cohort student was successfully created.' }
        format.json { render action: 'show', status: :created, location: @cohort_student }
      else
        format.html { render action: 'new' }
        format.json { render json: @cohort_student.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cohort_students/1
  # PATCH/PUT /cohort_students/1.json
  def update
    respond_to do |format|
      if @cohort_student.update(cohort_student_params)
        format.html { redirect_to @cohort_student, notice: 'Cohort student was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @cohort_student.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cohort_students/1
  # DELETE /cohort_students/1.json
  def destroy
    @cohort_student.destroy
    respond_to do |format|
      format.html { redirect_to cohort_students_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cohort_student
      @cohort_student = CohortStudent.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def cohort_student_params
      params.require(:cohort_student).permit(:student_id, :cohort_id)
    end
end
