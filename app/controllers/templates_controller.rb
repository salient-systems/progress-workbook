class TemplatesController < ApplicationController
  # disable the "application.html.erb" layout for all templates except index
  # without this the partial templates would be wrapped with html/body tags
  layout false, :except => :index
end
