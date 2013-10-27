class AssessmentTypesController < ApplicationController
  layout 'scaffold'
  before_action :set_assessment_type, only: [:show, :edit, :update, :destroy]

  # GET /assessment_types
  # GET /assessment_types.json
  def index
    if params[:section_id] != nil
      @assessment_types = Section.find(params[:section_id]).assessment_types
    else
      @assessment_types = AssessmentType.all
    end
  end

  # GET /assessment_types/1
  # GET /assessment_types/1.json
  def show
  end

  # GET /assessment_types/new
  def new
    @assessment_type = AssessmentType.new
  end

  # GET /assessment_types/1/edit
  def edit
  end

  # POST /assessment_types
  # POST /assessment_types.json
  def create
    @assessment_type = AssessmentType.new(assessment_type_params)

    respond_to do |format|
      if @assessment_type.save
        format.html { redirect_to @assessment_type, notice: 'Assessment type was successfully created.' }
        format.json { render action: 'show', status: :created, location: @assessment_type }
      else
        format.html { render action: 'new' }
        format.json { render json: @assessment_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /assessment_types/1
  # PATCH/PUT /assessment_types/1.json
  def update
    respond_to do |format|
      if @assessment_type.update(assessment_type_params)
        format.html { redirect_to @assessment_type, notice: 'Assessment type was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @assessment_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /assessment_types/1
  # DELETE /assessment_types/1.json
  def destroy
    @assessment_type.destroy
    respond_to do |format|
      format.html { redirect_to assessment_types_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment_type
      @assessment_type = AssessmentType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def assessment_type_params
      params.require(:assessment_type).permit(:name, :view)
    end
end
