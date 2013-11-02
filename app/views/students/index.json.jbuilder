json.array!(@students) do |student|
  json.extract! student, :id, :fname, :lname, :gender, :grade_level, :is_active, :sid
  json.url student_url(student, format: :json)
end
