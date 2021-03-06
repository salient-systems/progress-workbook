class SectionsController < ApplicationController
  layout 'scaffold'
  before_action :set_section, only: [:show, :edit, :update, :destroy]

  # GET /sections
  # GET /sections.json
  def index
    if params[:term_id] != nil and params[:user_id] != nil
      @sections = User.find(params[:user_id]).sections.includes(:user, :subject, :term).joins(:term).where("terms.id = ?", params[:term_id]).all
    elsif params[:term_id] != nil and params[:student_id] != nil
      @sections = Student.find(params[:student_id]).sections.includes(:user, :subject, :term).joins(:term).where("terms.id = ?", params[:term_id]).all
    elsif params[:user_id] != nil
      #TODO add logic to not include user when accessing sections nested in users
      @sections = User.find(params[:user_id]).sections.includes(:user, :subject, :term)
    elsif params[:term_id] != nil
      @sections = Term.find(params[:term_id]).sections.includes(:user, :subject, :term)
    elsif params[:student_id] != nil
      @sections = Student.find(params[:student_id]).sections.includes(:user, :subject, :term)
    else
      @sections = Section.includes(:user, :subject).all
    end
  end

  # GET /sections/1
  # GET /sections/1.json
  def show
  end

  # GET /sections/new
  def new
    @section = Section.new
  end

  # GET /sections/1/edit
  def edit
  end

  # POST /sections
  # POST /sections.json
  def create
    @section = Section.new(section_params)

    respond_to do |format|
      if @section.save
        format.html { redirect_to @section, notice: 'Section was successfully created.' }
        format.json { render action: 'show', status: :created, location: @section }
      else
        format.html { render action: 'new' }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sections/1
  # PATCH/PUT /sections/1.json
  def update
    respond_to do |format|
      if @section.update(section_params)
        format.html { redirect_to @section, notice: 'Section was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @section.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sections/1
  # DELETE /sections/1.json
  def destroy
    @section.destroy
    respond_to do |format|
      format.html { redirect_to sections_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_section
      #@section = Section.find(params[:id])
      @section = Section.includes(:user, :subject).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def section_params
      params.require(:section).permit(:name, :grade_level, :term_id, :period, :subject_id, :user_id)
    end
end
