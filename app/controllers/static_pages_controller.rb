class StaticPagesController < ApplicationController
  def home
    @user = User.find(1)
  end

  def help
  end
end
