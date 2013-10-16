json.array!(@sections) do |section|
  json.extract! section, :name, :grade_level, :start_date, :end_date, :subject_id, :user_id
  
  if section.user != nil
    json.set! :user do
      json.extract! section.user, :fname, :lname
    end
  end
  
  json.url section_url(section, format: :json)
end
