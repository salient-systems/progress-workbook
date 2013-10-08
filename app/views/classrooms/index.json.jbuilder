json.array!(@classrooms) do |classroom|
  json.extract! classroom, :name, :period, :start_date, :end_date, :grade_level, :user_id
  json.url classroom_url(classroom, format: :json)
end
