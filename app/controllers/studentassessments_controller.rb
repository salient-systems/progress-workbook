class StudentassessmentsController < ApplicationController
  layout 'scaffold'
  before_action :set_student, only: [:show, :edit, :update, :destroy]

  # GET /students
  # GET /students.json
  def index
    if params[:user_id] != nil
      @students = User.find(params[:user_id]).students
    elsif params[:section_id] != nil and params[:assessment_type_id] != nil
      assessmentId = Assessment.select("id").where("assessment_type_id = ?", params[:assessment_type_id]);
      criterionId = Criterion.select("id").where("assessment_id IN (?)", assessmentId).order(assessment_id: :asc, id: :asc);
      userId = Section.find(params[:section_id]).user_id;
      sectionId = params[:section_id];
      assessmenttypeId = params[:assessment_type_id];
      termId = Section.find(params[:section_id]).term_id;
      
      @students = Section.find(params[:section_id]).students

      #@students = Section.find(params[:section_id]).students.includes(:criterion_grades).where("criterion_grades.criterion_id IN (?)", criterionId);
      #@students.each do |item|
      #  item.criterion_grades.each do |a|
      #      a.assessment_name = Assessment.select("name").where("assessments.id = ?", a.assessment_id);
      #      a.criterion_name = Criterion.select("name").where("criterions.id = ?", a.criterion_id);
      #  end    
      #end

      @students.each do |item|
        #print "\n\nThe item id is #{item.id}\n\n"
        item.scores = CriterionGrade.where("criterion_id IN (?) AND student_id = ?", criterionId, item.id).order(assessment_id: :asc, id: :asc);
          
        if item.scores.length != criterionId.length
          j = 0;
          i = 0;
          print "\nitem scores length is: #{item.scores.length}\n"
          for i in (0..(criterionId.length-1))
            if item.scores.length == 0
              critassesId = Criterion.find(criterionId[i].id);
              CriterionGrade.create(criterion_id: "#{criterionId[i].id}", assessment_id: "#{critassesId.assessment_id}", student_id: "#{item.id}", section_id: "#{sectionId}", assessment_type_id: "#{assessmenttypeId}", user_id: "#{userId}");
            elsif item.scores[j].criterion_id != criterionId[i].id
              #print "they were not equal\n"
              critassesId = Criterion.find(criterionId[i].id);
              #print "Assessment Id is: #{critassesId.assessment_id}\n"
              CriterionGrade.create(criterion_id: "#{criterionId[i].id}", assessment_id: "#{critassesId.assessment_id}", student_id: "#{item.id}", section_id: "#{sectionId}", assessment_type_id: "#{assessmenttypeId}", user_id: "#{userId}");
            else
              j = j + 1;
            end
          end
          item.scores = CriterionGrade.where("criterion_id IN (?) AND student_id = ?", criterionId, item.id).order(criterion_id: :asc);
        end
        #item.scores = CriterionGrade.where("criterion_id IN (?) AND student_id = ?", criterionId, item.id).order(criterion_id: :asc);
      end
=begin   
      @students.each do |item|
        item.scores = "testing";
      end
=end      
    elsif params[:is_active] == 'true'
      @students = Student.where(is_active: 'true').all
    elsif params[:is_active] == 'false'
      @students = Student.where(is_active: 'false').all
    elsif params[:section_id] != nil
      @students = Section.find(params[:section_id]).students;
    elsif params[:cohort_id] != nil
      @students = Cohort.find(params[:cohort_id]).students;
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
    @students = Student.all
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
