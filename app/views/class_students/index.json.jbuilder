json.array!(@class_students) do |class_student|
  json.extract! class_student, :section_id, :student_id, :id
  json.url class_student_url(class_student, format: :json)
end
