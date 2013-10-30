json.array!(@sections) do |section|
  json.extract! section, :id, :name, :grade_level, :start_date, :end_date, :subject_id
  
  json.set! :user do
    json.extract! section.user, :fname, :lname, :id
  end

  json.set! :subject do
    json.extract! section.subject, :name
  end
  
  #json.url section_url(section, format: :json)
end
