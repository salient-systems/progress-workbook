class ClassStudentsController < ApplicationController
  before_action :set_class_student, only: [:show, :edit, :update, :destroy]

  # GET /class_students
  # GET /class_students.json
  def index
    @class_students = ClassStudent.all
  end

  # GET /class_students/1
  # GET /class_students/1.json
  def show
  end

  # GET /class_students/new
  def new
    @class_student = ClassStudent.new
  end

  # GET /class_students/1/edit
  def edit
  end

  # POST /class_students
  # POST /class_students.json
  def create
    @class_student = ClassStudent.new(class_student_params)

    respond_to do |format|
      if @class_student.save
        format.html { redirect_to @class_student, notice: 'Class student was successfully created.' }
        format.json { render action: 'show', status: :created, location: @class_student }
      else
        format.html { render action: 'new' }
        format.json { render json: @class_student.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /class_students/1
  # PATCH/PUT /class_students/1.json
  def update
    respond_to do |format|
      if @class_student.update(class_student_params)
        format.html { redirect_to @class_student, notice: 'Class student was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @class_student.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /class_students/1
  # DELETE /class_students/1.json
  def destroy
    @class_student.destroy
    respond_to do |format|
      format.html { redirect_to class_students_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_class_student
      @class_student = ClassStudent.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def class_student_params
      params.require(:class_student).permit(:section_id, :student_id)
    end
end
