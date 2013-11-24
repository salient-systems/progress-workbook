class CriterionsController < ApplicationController
  layout 'scaffold'
  before_action :set_criterion, only: [:show, :edit, :update, :destroy]

  # GET /criterions
  # GET /criterions.json 
  def index
    if params[:assessment_type_id] != nil
      assessmentId = Assessment.select("id").where("assessment_type_id = ?", params[:assessment_type_id]);
      @criterions = Criterion.where("assessment_id IN (?)", assessmentId).order(assessment_id: :asc, id: :asc);
    elsif params[:assessment_id] != nil
      @criterions = Assessment.find(params[:assessment_id]).criterions
    else
      @criterions = Criterion.all
    end
  end

  # GET /criterions/1
  # GET /criterions/1.json
  def show
  end

  # GET /criterions/new
  def new
    @criterion = Criterion.new
  end

  # GET /criterions/1/edit
  def edit
  end

  # POST /criterions
  # POST /criterions.json
  def create
    @criterion = Criterion.new(criterion_params)

    respond_to do |format|
      if @criterion.save
        format.html { redirect_to @criterion, notice: 'Criterion was successfully created.' }
        format.json { render action: 'show', status: :created, location: @criterion }
      else
        format.html { render action: 'new' }
        format.json { render json: @criterion.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /criterions/1
  # PATCH/PUT /criterions/1.json
  def update
    respond_to do |format|
      if @criterion.update(criterion_params)
        format.html { redirect_to @criterion, notice: 'Criterion was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @criterion.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /criterions/1
  # DELETE /criterions/1.json
  def destroy
    @criterion.destroy
    respond_to do |format|
      format.html { redirect_to criterions_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_criterion
      @criterion = Criterion.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def criterion_params
      params.require(:criterion).permit(:max, :name, :assessment_id)
    end
end
