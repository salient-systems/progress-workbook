class LoginController < ApplicationController
  def login
    puts params[:username]
    puts params[:password]
  end
end