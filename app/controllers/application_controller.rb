class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception

=begin
    logger.warn "*** BEGIN RAW REQUEST HEADERS ***"
    self.request.env.each do |header|
      logger.warn "HEADER KEY: #{header[0]}"
      logger.warn "HEADER VAL: #{header[1]}"
    end
    logger.warn "*** END RAW REQUEST HEADERS ***"

    request.headers['HTTP_AUTHTOKEN']
=end

  def authorize
    @@request.headers
  end

end
