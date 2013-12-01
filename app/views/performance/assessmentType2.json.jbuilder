json.array!(@criterion_grades) do |criterion|
  json.extract! criterion, :score, :student_id, :assessment_id
end