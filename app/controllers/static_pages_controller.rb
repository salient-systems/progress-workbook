class StaticPagesController < ApplicationController
  def home
    @user = User.find(1)
    @classrooms = @user.classrooms
  end

  def help
  end
end
