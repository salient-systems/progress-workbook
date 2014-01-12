json.array!(@students) do |student|
  json.extract! student, :id, :fname, :lname, :gender, :grade_level, :is_active, :sid
end
