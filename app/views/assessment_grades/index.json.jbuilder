json.array!(@assessment_grades) do |assessment_grade|
  json.extract! assessment_grade, :total, :assessment_id, :student_id
  json.url assessment_grade_url(assessment_grade, format: :json)
end
