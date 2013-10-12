json.array!(@students) do |student|
  json.extract! student, :fname, :lname, :gender, :grade_level, :is_active
  json.url student_url(student, format: :json)
end
