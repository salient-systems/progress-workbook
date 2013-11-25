class SearchController < ApplicationController
  # GET /students/search.json
  def search
    @students = Student.where(is_active: 'true').all
    @cohorts = Cohort.all
    @users = User.where(is_active: 'true').all
  end
end