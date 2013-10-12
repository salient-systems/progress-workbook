json.array!(@cohort_students) do |cohort_student|
  json.extract! cohort_student, :student_id, :user_id
  json.url cohort_student_url(cohort_student, format: :json)
end
