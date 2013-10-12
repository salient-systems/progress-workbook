json.array!(@criterion_grades) do |criterion_grade|
  json.extract! criterion_grade, :score, :student_id, :criterion_id, :assessment_id
  json.url criterion_grade_url(criterion_grade, format: :json)
end
