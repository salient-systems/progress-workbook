class StudentsController < ApplicationController
  layout 'scaffold'
  before_action :set_student, only: [:show, :edit, :update, :destroy]

  # GET /students
  # GET /students.json
  def index
    if params[:user_id] != nil
      @students = User.find(params[:user_id]).students
    elsif params[:section_id] != nil and params[:assessment_type_id] != nil
      @students = Section.find(params[:section_id]).students.includes(:criterion_grades).where("criterion_grades.assessment_id = ?", params[:assessment_type_id]);
    elsif params[:is_active] == 'true'
      @students = Student.where(is_active: 'true').all
    elsif params[:is_active] == 'false'
      @students = Student.where(is_active: 'false').all
    elsif params[:section_id] != nil
      @students = Section.find(params[:section_id]).students;
    elsif params[:cohort_id] != nil
      @students = Cohort.find(params[:cohort_id]).students.where(is_active: 'true');
    elsif params[:advanceSchoolYear] != nil
      Student.update_all("is_active = 'false'", "grade_level >= 8");
      Student.update_all("grade_level = grade_level + 1", "is_active = 'true' AND grade_level < 8");
    else
      @students = Student.all
    end
  end

  # GET /students/1
  # GET /students/1.json
  def show
  end

  # GET /students/new
  def new
    @student = Student.new
  end

  # GET /students/1/edit
  def edit
  end

  # POST /students
  # POST /students.json
  def create
    @student = Student.new(student_params)

    respond_to do |format|
      if @student.save
        format.html { redirect_to @student, notice: 'Student was successfully created.' }
        format.json { render action: 'show', status: :created, location: @student }
      else
        format.html { render action: 'new' }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /students/1
  # PATCH/PUT /students/1.json
  def update
    respond_to do |format|
      if @student.update(student_params)
        format.html { redirect_to @student, notice: 'Student was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /students/1
  # DELETE /students/1.json
  def destroy
    @student.destroy
    respond_to do |format|
      format.html { redirect_to students_url }
      format.json { head :no_content }
    end
  end

  # GET /students/search.json
  def search
    @students = Student.where(is_active: 'true').all
  end

  def import
    Student.import(params[:file])
    redirect_to "/#/settings"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_student
      @student = Student.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def student_params
      params.require(:student).permit(:fname, :lname, :gender, :grade_level, :is_active, :sid)
    end
end
