json.array!(@sections) do |section|
  json.extract! section, :name, :grade_level, :start_date, :end_date, :subject_id, :user_id
  json.url section_url(section, format: :json)
end
