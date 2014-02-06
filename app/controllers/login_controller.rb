class LoginController < ApplicationController
  def login
    puts params[:username]
    puts params[:password]
    @isValid = false
    @username = nil
    @password = nil

    user = User.where(username: params[:username], password: params[:password]).first

    if !user.blank?
      @isValid = true
      @username = user.username
      @is_admin = user.is_admin
    end
  end
end